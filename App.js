import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback } from 'react-native';

const Empty = 0;
const Ship = 1;
const Wreckage = 2;
const Miss = 3;

class SeaSpace extends React.Component {
  constructor(props) {
    super(props);

    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(e) {
    this.props.onPress(this.props.row, this.props.col);
  }

  render() {
    let contents = null;
    
    if (this.props.contents == Ship) {
      console.log("Ship at " + this.props.row + ',' + this.props.col);
      contents = <View style={styles.ship} />;
    }

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={styles.seaSpace}>{contents}</View>
      </TouchableWithoutFeedback>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {shipsLeft: 4, gameWon: false};
    this.renderSea = this.renderSea.bind(this);
    this.onPress = this.onPress.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.winGame = this.winGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.initializeGame = this.initializeGame.bind(this);

    this.totalShips = 4;

    this.initializeGame();
  }

  initializeGame() {
    this.state = {shipsLeft: this.totalShips, gameWon: false};
    this.startGame();
  }

  startGame() {
    console.log("resetting game...");

    this.gameColumns = 8;
    this.gameRows = 10;

    console.log(this.state);

    this.grid = [[],[]];

    for (i = 0; i < this.gameRows; i++) {
      this.grid[i] = [this.gameColumns];
      for (j = 0; j < this.gameColumns; j++) {
        this.grid[i][j] = Empty;
      }
    }

    let shipsPlaced = 0;
    while (shipsPlaced < this.totalShips) {
      let randomRow = Math.floor(Math.random() * this.gameRows);
      let randomCol = Math.floor(Math.random() * this.gameColumns);

      if (this.grid[randomRow][randomCol] == Empty) {
        this.grid[randomRow][randomCol] = Ship;
        shipsPlaced++;
      }
    }
  }

  resetGame() {
    this.setState({shipsLeft: this.totalShips, gameWon: false});
    this.startGame();
  }

  winGame() {
    alert("You Win!");
    this.setState({gameWon: true});
  }

  onPress(row, col) {
    console.log('row=' + row + ', col=' + col);
    console.log('contents=' + this.grid[row][col]);

    let contents = this.grid[row][col];
    if (contents == Ship) {
      this.grid[row][col] = Wreckage;
      let newShipsLeft = this.state.shipsLeft - 1;
      this.setState({shipsLeft: newShipsLeft});
      if (newShipsLeft == 0) {
        this.winGame();
      }
    }
  }

  renderSea() {
    let seaSpaces = [];

    for (i = 0; i < this.gameRows; i++) {
      for (j = 0; j < this.gameColumns; j++) {
        let key = '' + i + ',' + j;
        seaSpaces.push(<SeaSpace key={key} contents={this.grid[i][j]} row={i} col={j} onPress={this.onPress} />);
      }
    }
    return seaSpaces;
  }
  
  render() {
    let victoryMessage = this.state.gameWon ? <Text>You Win!</Text> : null;
    let resetGameButton = this.state.gameWon ? <Button title='Reset Game' onPress={this.resetGame} /> : null;
    console.log("Render State: ");
    console.log(this.state);
    return (
      <View style={styles.container}>
        <View style={{height: '5%', width: '50%', backgroundColor: 'black'}} />
        <View style={{height: '10%', backgroundColor: 'green', justifyContent: 'flex-end'}}>
          <Text>Battleship!</Text>
          {victoryMessage}
          {resetGameButton}
        </View>
        
        <View style={{width: '90%', aspectRatio: 0.8, padding: '1%', backgroundColor: 'yellow'}}>
          <View style={styles.ocean}>
            {this.renderSea()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ocean: {
    flex: 1,
    backgroundColor: 'aqua',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center'
  },
  seaSpace: {
    margin: '0.5%',
    width: '11.5%',
    aspectRatio: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ship: {
    width: '80%',
    height: '80%',
    backgroundColor: 'grey'
  }
});
