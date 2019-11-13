import React, { Component } from "react";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    sortByToggle: false
  };

  sortByToggleHandler = () => {
    this.setState(prevState => {
      return { sortByToggle: !prevState.sortByToggle };
    });
  };

  resetToggleHandler = () => {
    this.setState({ sortByToggle: false });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          sortToggle: this.sortByToggleHandler,
          resetToggle: this.resetToggleHandler
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
