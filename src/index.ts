import * as BabelTypes from '@babel/types';
import { Visitor } from '@babel/traverse';

type CallExpressionVisited = BabelTypes.CallExpression & { visited?: boolean };
type OptionalCallExpressionVisited = BabelTypes.OptionalCallExpression & { visited?: boolean };
type VisitorMethodParameters =
  // @ts-expect-error Type 'undefined' is not assignable to type '(...args: any) => any'.ts(2344)
  | Parameters<Visitor['CallExpression']>[0]
  // @ts-expect-error Type 'undefined' is not assignable to type '(...args: any) => any'.ts(2344)
  | Parameters<Visitor['OptionalCallExpression']>[0];

export default function pluginTransformArrayFind({ types: t }: { types: typeof BabelTypes }): {
  name: string;
  visitor: Visitor;
} {
  const CallExpressionOrOptionalCallExpression = (path: VisitorMethodParameters) => {
    const includesExpression: CallExpressionVisited | OptionalCallExpressionVisited = path.node;

    if (includesExpression.visited) return;

    const { callee, arguments: args } = includesExpression;

    if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return;

    if (!t.isIdentifier(callee.property, { name: 'find' }) && !t.isStringLiteral(callee.property, { value: 'find' })) {
      return;
    }

    const filterMemberExpression = t.isMemberExpression(callee)
      ? t.memberExpression(callee.object, t.identifier('filter'))
      : t.optionalMemberExpression(callee.object, t.identifier('filter'), undefined, callee.optional);

    const filterCallExpression = t.isCallExpression(includesExpression)
      ? t.callExpression(filterMemberExpression, args)
      : t.optionalCallExpression(filterMemberExpression, args, includesExpression.optional);

    const filterExpression = t.isCallExpression(includesExpression)
      ? t.memberExpression(filterCallExpression, t.numericLiteral(0), true)
      : t.optionalMemberExpression(filterCallExpression, t.numericLiteral(0), true, false);

    if (t.isArrayExpression(callee.object)) {
      path.replaceWith(filterExpression);
    } else {
      const isArrayExpression = t.callExpression(t.memberExpression(t.identifier('Array'), t.identifier('isArray')), [
        t.isSuper(callee.object) ? t.thisExpression() : callee.object,
      ]);

      includesExpression.visited = true;

      path.replaceWith(
        t.expressionStatement(t.conditionalExpression(isArrayExpression, filterExpression, includesExpression)),
      );
    }
  };
  return {
    name: 'transform array find',
    visitor: {
      OptionalCallExpression(path) {
        CallExpressionOrOptionalCallExpression(path);
      },
      CallExpression(path) {
        CallExpressionOrOptionalCallExpression(path);
      },
    },
  };
}
