import * as BabelTypes from '@babel/types';
import { Visitor } from '@babel/traverse';

type CallExpressionVisited = BabelTypes.CallExpression & { visited?: boolean };

export default function pluginTransformArrayFind({
  types: t,
}: {
  types: typeof BabelTypes;
}): { name: string; visitor: Visitor } {
  return {
    name: 'transform array find',
    visitor: {
      CallExpression(path) {
        const findExpression: CallExpressionVisited = path.node;

        if (findExpression.visited) return;

        const { callee, arguments: args } = findExpression;

        if (!t.isMemberExpression(callee)) return;

        if (
          !t.isIdentifier(callee.property, { name: 'find' }) &&
          !t.isStringLiteral(callee.property, { value: 'find' })
        ) {
          return;
        }

        const filterExpression = t.memberExpression(
          t.callExpression(t.memberExpression(callee.object, t.identifier('filter')), args),
          t.numericLiteral(0),
          true,
        );

        if (t.isArrayExpression(callee.object)) {
          path.replaceWith(filterExpression);
        } else {
          const isArrayExpression = t.callExpression(
            t.memberExpression(t.identifier('Array'), t.identifier('isArray')),
            [callee.object],
          );

          findExpression.visited = true;

          path.replaceWith(
            t.expressionStatement(t.conditionalExpression(isArrayExpression, filterExpression, findExpression)),
          );
        }
      },
    },
  };
}
