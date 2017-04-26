import React from 'react'
import styled, {Styled} from 'styled-jss'

const scoped = Styled()

const App = styled.div`
  margin: 50
`

const Header = styled.header`
  padding: 10
`

const Section = styled.section`
  color: red
`

const AnotherSection = styled(Section)`
  color: yellow
`

const Title = styled.h1`
  color: red
`

const test = 'test'
const Button = styled.button`
  margin: ${({margin = 0}) => margin};
  & + & + ${test} {
    color: ${() => {}}
  }
`

const ScopedButton = scoped.button`
  color: green
`

const ButtonByObject = styled.button({color: 'red'})

export default () => (
  <App>
    <Header>
      <Title>Title</Title>
    </Header>

    <Section data-name="content">
      <Button>primitive test</Button>
      <Button margin={10}>dynamic primitive test</Button>
      <ScopedButton>scoped button</ScopedButton>
      <ButtonByObject>button by object</ButtonByObject>
    </Section>

    <AnotherSection>Another section</AnotherSection>
  </App>
)
