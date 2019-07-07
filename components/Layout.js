import Header from './Header'
import Navigation from './Navigation'

class Layout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: this.props.title,
      description: this.props.description,
      url: this.props.url
    }
  }

  render () {
    return(
      <div>
        <Header title={this.state.title} description={this.state.description} url={this.state.url} />
        <Navigation />
        {this.props.children}
      </div>
    )
  }
}

export default Layout
