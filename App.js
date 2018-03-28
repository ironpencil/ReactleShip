import React from 'react';
import { StyleSheet, Text, View, Button, TouchableWithoutFeedback } from 'react-native';

const Empty = 0;
const Ship = 1;
const Wreckage = 2;
const Miss = 3;

class EmptySpace extends React.Component {
  render() {
    return <View style={styles.seaSpace}></View>;
  }
}

class WreckageSpace extends React.Component {
  render() {
    return (
      <View style={styles.ship}>
        <Text style={{fontSize: 40, fontWeight: 'bold'}}>*</Text>
      </View>
    );
  }
}

class MissSpace extends React.Component {
  render() {
    return (
      <View>
          <Text style={{fontSize: 40, fontWeight: 'bold'}}>x</Text>
      </View>
    );
  }
}

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
    
    /*if (this.props.contents == Ship) {
      contents = <View style={styles.ship} />;
    } else */
    
    if (this.props.contents == Wreckage) {
      contents = <WreckageSpace />;
    } else if (this.props.contents == Miss) {
      contents = <MissSpace />;
    } else {
      contents = <EmptySpace />;
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

    this.totalShips = 6;

    this.initializeGame();
  }

  initializeGame() {
    this.state = {shipsLeft: this.totalShips, shots: 0, bestScore: 0, gameWon: false};
    this.startGame();
  }

  startGame() {
    console.log("resetting game...");

    this.gameColumns = 5;
    this.gameRows = 6;

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
    
    let bestScore = this.state.bestScore;
    
    if (this.state.gameWon) {
      if (bestScore == 0 || this.state.shots < bestScore) {
        bestScore = this.state.shots;
      }
    }

    this.setState({shipsLeft: this.totalShips, shots: 0, bestScore: bestScore, gameWon: false});
    this.startGame();
  }

  winGame() {
    alert("You Win!");
    this.setState({gameWon: true});
  }

  onPress(row, col) {
    console.log('row=' + row + ', col=' + col);
    console.log('contents=' + this.grid[row][col]);

    if (this.state.gameWon) {
      return;
    }

    let contents = this.grid[row][col];
    if (contents == Ship) {
      this.grid[row][col] = Wreckage;
      let newShipsLeft = this.state.shipsLeft - 1;
      this.setState({shipsLeft: newShipsLeft, shots: this.state.shots+1});
      if (newShipsLeft == 0) {
        this.winGame();
      }
    } else if (contents == Empty) {
      this.grid[row][col] = Miss;
      this.setState({shots: this.state.shots+1});
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
    let bestScore = this.state.bestScore > 0 ? <Text>Best Score: {this.state.bestScore}</Text> : null;

    console.log("Render State: ");
    console.log(this.state);
    return (
      <View style={styles.container}>
        
        <View style={{height: '15%', width: '80%', backgroundColor: 'green', alignItems: 'center', justifyContent: 'flex-end'}}>
          <Text>Battleship!</Text>
          {bestScore}
          <Text>Shots: {this.state.shots}</Text>
          {victoryMessage}
        </View>

        <Button title='Reset Game' onPress={this.resetGame} />
        
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
    alignContent: 'center',
    justifyContent: 'center'
  },
  seaSpace: {
    margin: '0.5%',
    width: '18.5%',
    aspectRatio: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ship: {
    width: '80%',
    height: '80%',
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
