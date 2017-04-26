<a href="https://github.com/cssinjs/styled-jss">
  <img alt="styled-jss" src="https://github.com/cssinjs/logo/blob/master/styled-jss-logo.png" height="150px" />
</a>

# babel-plugin-styled-jss
Created on top of [PreJSS](https://github.com/axept/prejss).

## Install

```sh
npm install --save babel-plugin-styled-jss
```

## Usage

**.babelrc**
```js
{
  plugin: 'styled-jss'
}
```

This plugin transforms
```js
const Button = styled.button`
  padding: 10;
  color: ${({color}) => color}
`
```
to
```js
const Button = styled('button', {
  padding: 10,
  color: ({color}) => color
})
```

And you can also use plain objects:
```js
const Button = styled.button({
  color: 'red'
})
```

## Recognition

`babel-plugin-styled-jss` can recognize this patterns:

```js
  import styled, {Styled} from 'styled-jss'

  const Button = styled.button({
    color: 'blue'
  })

  const scoped = Styled({
    baseButton: {
      color: 'green'
    }
  })
  const AnotherButton = scoped.button({
    composes: '$baseButton'
  })
```

And you can also use DI for example, but you need to name it as `styled`:

```js
export default (styled) => {
  const Button = styled.button({color: 'red'})
}
```

## Links
- [styled-jss](https://github.com/cssinjs/styled-jss)
- [PreJSS](https://github.com/axept/prejss)

## License
MIT
