import React, { Component } from 'react';
import './App.css';
import * as Chords from './chords.js';


const avalible_chords = [
  { template: ['1', '3', '5'], label: 'major', index: 0},
  { template: ['1', '3b', '5'], label: 'minor', index: 1},
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
      guitar_chord: { 1: 1, 2: 1, 3:2, 4: 1, 5: 1, 6: 1, root_note: {note:"F", bar: 1 , string: 6}},
      guitar_chords:[],
      chormatical_scale : ["C","C#|Db","D","D#|Eb","E","F","F#|Gb","G","G#|Ab","A","A#|Bb","B"],
      major_scales : [
        { note: "C" , label: "C" },
        { note: "C#|Db" , label: "C#" },
        { note: "D" , label: "D" },
        { note: "D#|Eb" , label: "Eb" },
        { note: "E" , label: "E" },
        { note: "F" , label: "F" },
        { note: "F#|Gb" , label: "F#" },
        { note: "G" , label: "G" },
        { note: "G#|Ab" , label: "Ab" },
        { note: "A" , label: "A" },
        { note: "A#|Bb" , label: "Bb" },
        { note: "B" , label: "B" }
      ]
    }

  }

  getSelectedKey(obj){
    this.setState({key : obj, chord_type: -1, key_scale: Chords.findMajorScale(obj.note), chord: []})
  }

  getSelectedChord(index){
    var chord = Chords.createChord(this.state.key.note, avalible_chords[index].template)
    this.setState({chord_type: index, chord: chord, guitar_chords: Chords.findGuitarChords(chord)})

  }

  isChordTypeBtnActive(index){
    if(this.state.chord_type === index){
      return "chord-types-btn active"
    }else{
      return "chord-types-btn"
    }
  }

  isCromathicScaleBtnActive(note){
    if(this.state.key.note === note){
      return "col-lg-1 cromathic-scale-btn active"
    }else{
      return "col-lg-1 cromathic-scale-btn"
    }
  }

  createTableture(guitar_chord, root_note){

    var min_bar = 14;
    var max_bar = 0
    for(var i = 1; i < 7; i++){
      if(i in guitar_chord){
        if(guitar_chord[i] === 0)continue
        if(root_note.bar === 1)min_bar = 1;
        if(guitar_chord[i] >= root_note.bar && max_bar < guitar_chord[i]) max_bar = guitar_chord[i]
        else if(min_bar > guitar_chord[i])min_bar = guitar_chord[i]
      }
    }

    var guitar_chord_tablature = []

    var guitar_chord_tablature_row_head = []
    var roman_numbers = [
      <span></span>,<span>&#8544;</span>, <span>&#8545;</span>,
      <span>&#8546;</span>, <span>&#8547;</span>,
      <span>&#8548;</span>, <span>&#8549;</span>,
      <span>&#8550;</span>, <span>&#8551;</span>,
      <span>&#8552;</span>, <span>&#8553;</span>,
      <span>&#8554;</span>,<span>&#8555;</span>,
      <span>&#8555;&#8544;</span>,<span>&#8555;&#8544;&#8544;</span>
    ]

    guitar_chord_tablature_row_head.push(<th></th>)
    for(var i = min_bar; i < max_bar + 1; i++){
      guitar_chord_tablature_row_head.push(<th>{roman_numbers[i]}</th>)
    }

    guitar_chord_tablature.push(<tr>{guitar_chord_tablature_row_head}</tr>)
    for(var i = 1; i < 7; i++){
      var guitar_chord_tablature_row = []
      if(i in guitar_chord){
        if(guitar_chord[i] === 0) guitar_chord_tablature_row.push(<td><div><span className="string">O</span></div></td>)
        else guitar_chord_tablature_row.push(<td><div><span className="string">{i}</span></div></td>)
        for(var j = min_bar; j < max_bar + 1; j++){
          if(j === guitar_chord[i]){
            guitar_chord_tablature_row.push(<td><div><span className="dot"></span></div></td>)
          }else{
            guitar_chord_tablature_row.push(<td></td>)
          }
        }
      }else{
        guitar_chord_tablature_row.push(<td><div><span className="string">X</span></div></td>)
        for(var j = min_bar; j < max_bar + 1; j++){
            guitar_chord_tablature_row.push(<td></td>)
        }
      }
      guitar_chord_tablature.push(<tr>{guitar_chord_tablature_row}</tr>)
    }

    return guitar_chord_tablature
  }


  render() {
    var avalible_chords_type = null
    if(this.state.key){
      avalible_chords_type = (avalible_chords.map((obj, i)=><div key={i} className={this.isChordTypeBtnActive(obj.index)} onClick={()=>this.getSelectedChord(obj.index)}>{this.state.key.label + obj.label}</div>))
    }

    var guitar_chord_tablatures = []

    this.state.guitar_chords.map((obj)=>{
      var root_bass_bar = obj.root_bass.bar
      obj.chords.map((chord)=>{
        console.log(chord)
        guitar_chord_tablatures.push(
          <div className="col-lg-2">
            <table className="guitar-chord-table">
              <tbody className="guitar-chord-table-body">
                {this.createTableture(chord, obj.root_bass)}
              </tbody>
            </table>
          </div>)
      })
    })


    return (
      <div className="App">
        <header className="App-header">

          <h1 className="App-title">Guitar Chord Generator</h1>

        </header>
        <div className="container-fluid">
          <div className="col-lg-1"></div>
          <div className="col-lg-10">
            <div className="row cromathic-scale">
              <p>To get started, choose frome any given key at the bottom.</p>

              <div className="col-lg-12 ">
                <div className="row">
                  {this.state.major_scales.map((obj, i) => <div key={i} className={this.isCromathicScaleBtnActive(obj.note)} onClick={()=>this.getSelectedKey(obj)}>{obj.label}</div>)}
                </div>
                <div className="row">
                  <h2 className="App-title">{this.state.key_scale.map((note, i)=><span key={i} className="key-scale">{note}</span>)}</h2>
                </div>
                <div className="row chord-types">
                    {avalible_chords_type}
                </div>
                <div className="row">
                    <h2 className="App-title">{this.state.chord.map((note, i)=><span key={i} className="key-scale">{note}</span>)}</h2>
                </div>
                <div className="row guitar-chords">

                  {guitar_chord_tablatures}

                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-1">

          </div>

        </div>
      </div>
    );
  }
}

export default App;
