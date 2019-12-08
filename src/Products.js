import React, { Component } from 'react'
import Filters from './Filters'
import ProductTable from './ProductTable'
import ProductForm from './ProductForm'
import socketIOClient from 'socket.io-client'

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filterText: '',
            products: '',
            endpoint: 'http://localhost:5000/',
            error: ''
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleDestroy = this.handleDestroy.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
      // connect to the socket at the specified endpoint
      const {endpoint} = this.state;
      const socket = socketIOClient(endpoint)
      // listen for broadcast and do something
      socket.on("updates", (data) => {
        console.log("There are updates!")
        this.getProducts()
      })

    }

    resetError = () => {
      this.setState({ error: ''})
    }

    getProducts = () => {
      this.requestAllProducts()
      .then(
        res => this.setState({ products: res})
      )
      .catch(err => console.log(err))
    }

    requestAllProducts = async() => {
      const response = await fetch('/product/get')
      const body = await response.json()
      if (response.status !== 200) {
        this.setState({ error: body.message})
        throw Error(body.message)
      }
      return body
    }

    requestCreateProduct = async(product) => {
      let jsonProduct = JSON.stringify(product)
      const response = await fetch('/product/create',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: jsonProduct
        })
      const body = await response
      if (response.status !== 200) {
        this.setState({ error: body})
        throw Error(body)
      }
    }

    requestDeleteProduct = async(productid) => {
      const response = await fetch('/product/delete/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({id: productid})
        })
        const body = await response
        if (response.status !== 200) {
          this.setState({ error: body.message})
          throw Error(body.message)
        }
    }

    requestUpdateProduct = async(product) => {
      const response = await fetch('/product/update/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(product)
      })
      const body = await response
      if (response.status !== 200) {
        this.setState({ error: body})
        throw Error(body)
      }
    }

    handleFilter(filterInput) {
      this.setState(filterInput)
    }

    handleSave(product) {
      if (!product.id) {
          product.id = new Date().getTime()
      }

      // check to see if we have that product already
      let productsArray = Object.keys(this.state.products).map((pid) => this.state.products[pid])
      // if product already exists, then update it
      if (productsArray.some(item => item.id === parseInt(product.id))) {
        console.log("Includes")
        this.requestUpdateProduct(product)
      } else {
        // send the data to server
        this.requestCreateProduct(product)
      }
    }

    handleDestroy(productId) {
      this.requestDeleteProduct(productId)
    }

    // handleUpdate(product) {
    //   let productsArray = Object.keys(this.state.products).map((pid) => this.state.products[pid])
    //   if (productsArray.some(item => item.id === product.id)) {
    //     console.log("Includes")
    //     this.requestUpdateProduct(product)
    //   }
    // }

    render () {
        return (
            <div>
                <h1>My Inventory</h1>
                <Filters
                    onFilter={this.handleFilter}></Filters>
                <ProductTable
                    products={this.state.products}
                    filterText={this.state.filterText}
                    onDestroy={this.handleDestroy}></ProductTable>
                <ProductForm
                    onSave={this.handleSave}></ProductForm>
                  <div>{this.state.error}</div>
            </div>
        )
    }
}

export default Products
