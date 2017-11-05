import React, { Component } from 'react';
import './App.css';
import * as Chords from './chords.js';



const avalible_chords = [
  { template: ['1', '3', '5'], label: 'Major', index: 0},
  { template: ['1', '3b', '5'], label: 'Minor', index: 1},
  { template: ['1', '3', '5', '7b'], label: '7', index: 2},
  { template: ['1', '3', '5', '7'], label: 'maj7', index: 3},
  { template: ['1', '3b', '5b'], label: 'dim', index: 4},
  { template: ['1', '3b', '5b', '7b'], label: 'dim7', index: 5},
  { template: ['1', '4', '5'], label: 'sus4', index: 6},
  { template: ['1', '3', '5', '6'], label: '6', index: 7},
  { template: ['1', '3', '5', '9'], label: 'add9', index: 8},
  { template: ['1', '3', '5','6','9'], label: '6add9', index: 9},
  { template: ['1', '3', '5', '9'], label: 'maj9', index: 10},
  { template: ['1', '3', '5', '7','9','13'], label: 'maj13', index: 11},

]


class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      key : "",
      key_scale : [],
      chord_type_index: -1,
      chord : [],
      chormatical_scale : ["C","Cis|Db","D","Dis|Eb","E","F","Fis|Gb","G","Gis|Ab","A","Ais|Bb","B"]
    }

  }

  getSelectedKey(note){
    this.setState({key : note, chord_type: -1, key_scale: Chords.findMajorScale(note)})
  }

  getSelectedChord(index){
    this.setState({chord_type: index, chord: Chords.createChord(this.state.key, avalible_chords[index].template)})
  }

  isChordTypeBtnActive(index){
    if(this.state.chord_type === index){
      return "chord-types-btn active"
    }else{
      return "chord-types-btn"
    }
  }

  isCromathicScaleBtnActive(note){
    if(this.state.key === note){
      return "col-lg-1 cromathic-scale-btn active"
    }else{
      return "col-lg-1 cromathic-scale-btn"
    }
  }

  render() {
    var avalible_chords_type = null
    if(this.state.key){
      avalible_chords_type = (avalible_chords.map((obj, i)=><div key={i} className={this.isChordTypeBtnActive(obj.index)} onClick={()=>this.getSelectedChord(obj.index)}>{this.state.key +" "+ obj.label}</div>))
    }

    return (
      <div className="App">
        <header className="App-header">

          <h1 className="App-title">Guitar Chord Generator</h1>

        </header>
        <div className="container-fluid">
          <div className="col-lg-3"></div>
          <div className="col-lg-6">
            <div className="row cromathic-scale">
              <p>To get started, choose frome any given key at the bottom.</p>
              <h2 className="App-title">{this.state.key_scale.map((note)=><span className="key-scale">{note}</span>)}</h2>
              <div className="col-lg-12 ">
                <div className="row">
                  {this.state.chormatical_scale.map((note, i) => <div key={i} className={this.isCromathicScaleBtnActive(note)} onClick={()=>this.getSelectedKey(note)}>{note}</div>)}
                </div>
                <div className="row">
                    {avalible_chords_type}
                </div>
                <div className="row">
                    {this.state.chord.map((note)=><span className="key-scale">{note}</span>)}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">

          </div>

        </div>
      </div>
    );
  }
}

export default App;
