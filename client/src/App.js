import React, { Component } from 'react'; // eslint-disable-line
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      recipes: [],
    };
  }

  componentDidMount() {
    this.fetchItems();
    this.fetchRecipes();
  }

  fetchItems() {
    fetch('items.json')
      .then(response => response.json())
      .then((data) => {
        this.setState({ items: data });
      });
  }

  fetchRecipes() {
    fetch('recipes.json')
      .then(response => response.json())
      .then((data) => {
        this.setState({ recipes: data });
      });
  }

  render() {
    return (
      <div className="App">
        <div className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <a className="navbar-brand">zelda-gourmand</a>
            </div>
            <div className="navbar-collapse collapse">
              <ul className="nav navbar-nav">
                <li><a>My Inventory</a></li>
                <li><a>Materials</a></li>
                <li><a>Recipes</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container">
          <ul className="text-left">
            {this.state.items.map(item => (
              <li key={item.id}>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
