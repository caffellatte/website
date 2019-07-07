import React from 'react'
import Link  from 'next/link'
import getConfig from 'next/config'
import Router, { withRouter } from 'next/router'
import Layout from '../components/Layout.js'
import fetch from 'isomorphic-unfetch'
import { CSVLink, CSVDownload } from 'react-csv'

const { publicRuntimeConfig } = getConfig()

class Website extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: publicRuntimeConfig.title,
      description: publicRuntimeConfig.description,
      url: publicRuntimeConfig.url
    }
  }
  static async getInitialProps () {
    return ({})
  }
  render () {
    let i = 1
    return(
      <Layout title={this.state.title} description={this.state.description} url={this.state.url}>
        <div className="hero">
          <h1 className="title">{this.state.title}</h1>
          <p className="description">
             {this.state.description}
          </p>
        </div>
      </Layout>
    )
  }
}

export default withRouter(Website)

