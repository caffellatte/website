import React from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import getConfig from 'next/config'
import Router, { withRouter } from 'next/router'
import ReactGA from 'react-ga'

const { publicRuntimeConfig } = getConfig()

const defaultDescription = ''
const defaultOGURL = ''
const defaultOGImage = ''

const gaTrackingId = publicRuntimeConfig.gaTrackingId

class Header extends React.Component {
  constructor(props) {
    super(props)

    const {router: {pathname}} = this.props
    this.state = {
      title: this.props.title || '',
      url: `${this.props.url}${pathname}` || defaultOGURL,
      description: this.props.description || defaultDescription,
      ogImage: this.props.ogImage || defaultOGImage
    }
    Router.onRouteChangeComplete = () => {
      ReactGA.initialize(gaTrackingId)
      ReactGA.pageview(`${this.props.url}${pathname}`)
    }
  }
  render() {
    return (
      <Head>
        <meta charSet="UTF-8" />
        <title>{this.state.title}</title>
        <meta
          name="description"
          content={this.state.description}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
        <link rel="apple-touch-icon" href="/static/touch-icon.png" />
        <link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
        <link rel="icon" href="/static/favicon.ico" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`} />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || []
          function gtag(){
            dataLayer.push(arguments)
          }
          gtag('js', new Date())
          gtag('config', '${gaTrackingId}')
        `}} />
        <meta
          property="og:url"
          content={this.state.url}
        />
        <meta
          property="og:title"
          content={this.state.title}
        />
        <meta
          property="og:description"
          content={this.state.description}
        />
        <meta
          name="twitter:site"
          content={this.state.url}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={this.state.ogImage}
        />
        <meta
          property="og:image"
          content={this.state.ogImage}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
    )
  }
}

Header.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  ogImage: PropTypes.string
}

export default withRouter(Header)
