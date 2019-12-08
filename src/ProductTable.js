import React, { Component } from 'react'
import ProductRow from './ProductRow'

class ProductTable extends Component {
    constructor(props) {
        super(props)
        this.handleDestroy = this.handleDestroy.bind(this)
    }

    handleDestroy(id) {
        this.props.onDestroy(id)
    }

    render () {
        let productsArray = Object.keys(this.props.products).map((pid) => this.props.products[pid])
        let rows = []

        productsArray.forEach((product) => {
          var filter = this.props.filterText
          if (product.name.indexOf(filter) === 0 || product.id.toString().indexOf(filter) === 0 || product.category.indexOf(filter) === 0 || product.price.toString().indexOf(filter) === 0) {
            rows.push (
                <ProductRow
                    product={product}
                    key={product.id}
                    onDestroy={this.handleDestroy}></ProductRow>
            )
          }
            // if (product.name.indexOf(this.props.filterText) === -1) {
            //     return
            // }
            // rows.push (
            //     <ProductRow
            //         product={product}
            //         key={product.id}
            //         onDestroy={this.handleDestroy}></ProductRow>
            // )
        })

        return (
            <div>
                <table className="table table-striped table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>In Stock</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ProductTable
