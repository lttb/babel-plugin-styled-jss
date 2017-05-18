/* eslint-disable no-template-curly-in-string */

const stripIndent = require('strip-indent')
const template = require('babel-template')

const prepareConfig = require('./utils/prepare-config')

module.exports = ({types: t}) => {
  let config

  const styledNames = new Set('styled')
  const StyledNames = new Set('Styled')

  return {
    pre() {
      if (config) {
        return
      }

      config = prepareConfig(this.opts)
    },

    visitor: {
      ImportDefaultSpecifier(p) {
        const {value} = p.parentPath.node.source

        if (value !== 'styled-jss') return

        const [defaultImport, ...imports] = p.parentPath.node.specifiers

        styledNames.add(defaultImport.local.name)

        const StyledNode = imports.find(({imported}) => imported.name === 'Styled')
        if (StyledNode) {
          StyledNames.add(StyledNode.local.name)
        }
      },

      CallExpression(p) {
        const {callee, arguments: args} = p.node

        if (callee.name === 'require') {
          if (!(args[0] && args[0].value === 'styled-jss')) return
          let id

          if (p.parentPath.node.type === 'MemberExpression') {
            id = p.parentPath.parentPath.node.id
          }
          else {
            id = p.parentPath.node.id
          }

          if (id.type === 'Identifier') {
            styledNames.add(id.name)
          }
          else if (id.type === 'ObjectPattern') {
            id.properties.some((node) => {
              if (node.key.name === 'Styled') {
                StyledNames.add(node.value.name)
                return true
              }

              return false
            })
          }

          return
        }

        if (StyledNames.has(callee.name)) {
          styledNames.add(p.parentPath.node.id.name)
          return
        }

        if (!(callee.object && styledNames.has(callee.object.name))) {
          return
        }

        const {object, property} = callee

        p.replaceWith(t.callExpression(
          t.callExpression(t.toExpression(object), [t.stringLiteral(property.name)]),
          [...args]
        ))
      },

      TaggedTemplateExpression(p) {
        const {tag} = p.node

        let elem
        let callee

        if (tag.callee && styledNames.has(tag.callee.name)) {
          elem = t.identifier(tag.arguments[0].name)
          callee = tag.callee
        }
        else if (tag.object && styledNames.has(tag.object.name)) {
          elem = t.stringLiteral(tag.property.name)
          callee = tag.object
        }
        else return

        const {quasis, expressions} = p.node.quasi

        const getPlaceholder = index => `VAR_${index}`

        const strings = quasis.map(quasi => quasi.value.cooked)
        const values = expressions.reduce((acc, expr, index) =>
          Object.assign(acc, {[getPlaceholder(index)]: expr}), {})

        const css = stripIndent(strings
          .map((str, index) => (index !== 0
            ? getPlaceholder(index - 1) + str
            : str
          ))
          .join('')
        )

        const jssObject = config.parse(css)

        const jssObjectString = JSON.stringify(jssObject)
          .replace(/(,|{)"(.*?)":/g, (match, before, prop) => (prop.includes('VAR_')
            ? `${before}[\`${prop.replace(/VAR_\d+/, '${$&}')}\`]:`
            : `${before}${prop}:`
          ))
          .replace(/:"(.*?)(VAR_\d+)(.*?)"/g, (match, prev, val, next) => (prev || next
            ? `:\`${prev}\${${val}}${next}\``
            : `:${val}`
          ))

        const res = template(`(${jssObjectString})`)(values)

        p.replaceWith(t.callExpression(
          t.callExpression(t.toExpression(callee), [elem]),
          [res.expression]
        ))
      },
    },
  }
}
