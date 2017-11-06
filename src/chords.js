

var chromatic_scale = ["C","C#|Db","D","D#|Eb","E","F","F#|Gb","G","G#|Ab","A","A#|Bb","B"]
var chromatic_scale_ag = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
var chromatic_scale_lo = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"]
var major_scale = [2,2,1,2,2,2,1]


var guitar_strings = [
  {"string": "1","notes": ["E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb"] },
  {"string": "2","notes": ["B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db"] },
  {"string": "3","notes": ["G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A"] },
  {"string": "4","notes": ["D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E"] },
  {"string": "5","notes": ["A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Bb","B","C","Db"] },
  {"string": "6","notes": ["E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb"] },
]

var first_string = ["E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb"]
var second_string = ["B","C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db"]
var third_string = ["G","Ab","A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Ab","A"]
var fourth_string = ["D","Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D","Eb","E"]
var fifth_string = ["A","Bb","B","C","Db","D","Eb","E","F","Gb","G","Bb","B","C","Db"]
var sixth_string = first_string

export function getStringNote(string, bar){
  var note = ""
  guitar_strings.map((obj)=>{
    if(parseInt(obj.string) === string){
      note = obj.notes[bar]
      return true
    }
  })
  return note
}

export function findMajorScale(key){
    var searched_scale = []
    var step = 0
    var lowered = false
    if( key === "F" || key === "D#|Eb" || key === "G#|Ab" || key === "A#|Bb" ) lowered = true

    for(var i=0;i < chromatic_scale.length;i++){

        if(chromatic_scale[i] === key){

          for(var j=0;j < major_scale.length;j++){
            var index_postion = step + i

            if(index_postion >= chromatic_scale.length){
              index_postion -= chromatic_scale.length
            }
            var searched_note = chromatic_scale[index_postion]
            if(searched_note.includes("|")) searched_note = lowered ? chromatic_scale[index_postion].split("|")[1] : chromatic_scale[index_postion].split("|")[0]

            searched_scale.push(searched_note)
            step += major_scale[j]
          }

          return searched_scale

        }
    }
}



export function createChord(key, chord_schema){

  var chord_major_scale = findMajorScale(key)
  //console.log(chord_schema)
  var chord = []
  chord_schema.map(function(x){

    if(x.includes("b")){
      x = parseInt(x[0])
      if( x > 7) x = x % 7

      var key = chord_major_scale[x - 1]
      chromatic_scale.map(function(x,i){
        if(key.includes("#")){
          if(x === key[0]){
            i += 1
            if(i > chromatic_scale.lenght ) i = chromatic_scale.lenght - i // NOTE: not sure about that

            if(chromatic_scale[i - 1].includes("|"))chord.push(chromatic_scale[i - 1].split("|")[1])
            else chord.push(chromatic_scale[i - 1])

          }
        }else if(key.includes("b")){
          if(x === key[0]){
            i -= 1
            if(i < 0) i = chromatic_scale.lenght + i
            if(chromatic_scale[i - 1].includes("|"))chord.push(chromatic_scale[i - 1].split("|")[1])
            else chord.push(chromatic_scale[i - 1])
          }
        }
        else{
          if(x === key){
            if(i === 0) i = chromatic_scale.lenght

            if(chromatic_scale[i - 1].includes("|"))chord.push(chromatic_scale[i - 1].split("|")[1])
            else chord.push(chromatic_scale[i - 1])
          }
        }
      })
    }else{
      x = parseInt(x)
      if( x > 7) x = x % 7
      chord.push(chord_major_scale[x - 1])
    }
  })

  return chord
}



function findChordRootBassPosibilities(chord){
  var root = chord[0]
  var root_note_positions = []
  sixth_string.map(function(key, i){
    if(root.includes("|")) root = root.split("|")[1]

    if(key === root)root_note_positions.push({"string": "6", "bar": i, "note": root})
    else if(fifth_string[i] === root)root_note_positions.push({"string": "5", "bar": i, "note": root})
    else if(fourth_string[i] === root)root_note_positions.push({"string": "4", "bar": i, "note": root})
  })

  return root_note_positions
}

function findNote(chord, guitar_string, position, distance){

  var note_posibilities = {"string":guitar_string.string, "notes":[]}

  for(var i = 0; i < chord.length; i++){

    if(chord[i].includes("|"))chord[i] = chord[i].split("|")[1]

    for(var j = position; j < distance; j++){

      if(chord[i] === guitar_string.notes[j]){

        note_posibilities.notes.push({"bar": j, "note": chord[i]})
      }
    }
  }

  return note_posibilities
}

function findChord(root_bass, chord, distance){

  var root_bass_string = root_bass.string
  var root_bass_position = root_bass.bar
  var chord_notes_posibilities = []
  guitar_strings.map(function(x){
    if(x.string !== root_bass_string){

      if(root_bass_position == 0){
        chord_notes_posibilities.push(findNote(chord, x, 0, distance))
      }else if( root_bass_position < distance){
        chord_notes_posibilities.push(findNote(chord, x, 0, root_bass_position + distance))
      }else if( root_bass_position >= distance){
        chord_notes_posibilities.push(findNote(chord, x, root_bass_position - distance, root_bass_position + distance))
      }

    }
  })

  return chord_notes_posibilities
}

function findChordNotesNearby(chord, chord_root_bass, posible_chord_notes, distance){
  var root_bass_position = chord_root_bass.bar

  posible_chord_notes.map(function(x){
    if(x.notes.length === 1){

    }else{

    }
    console.log(x.notes.length)
  })
  var current_chord = chord


  //console.log(JSON.stringify(posible_chord_notes, null, null))
  //console.log(" ")
}



function findChordNotesOnGuitar(guitar_chord_root_note, chord, distance){
  var root_note = guitar_chord_root_note.note
  var root_note_string = guitar_chord_root_note.string
  var root_note_bar =  guitar_chord_root_note.bar

  var starting_position = root_note_bar - distance - 1
  if(root_note_bar < distance)starting_position = 0

  var ending_position = root_note_bar + distance - 1
  if(ending_position > guitar_strings[0].notes.length - 1)ending_position = guitar_strings[0].notes.length - 1
  //console.log(starting_position+" "+ending_position)
  var chord_notes_on_guitar = []
  chord.map(function(note){
    if(note.includes("|"))note = note.split("|")[1]

    for(var i = 0; i < parseInt(root_note_string) - 1; i++){
      for(var j = starting_position; j < ending_position; j++){
        if(guitar_strings[i].notes[j] ===  note){
          var distance = root_note_bar - j
          if(j === 0) distance = 0
          chord_notes_on_guitar.push({"note":note, "string":i + 1, "bar":j, "distance": distance})
          //console.log(guitar_strings[i].string+"|"+j+"|"+note)
        }

      }
    }
  })
  return chord_notes_on_guitar
}

// NOTE: should do variations of all avalible chords in the future, to be certain that you didnt skip any of them
function findPosibleChords(chord, root_bass, posible_chord_notes, distance){
  console.log()
  var guitar_chords = []
  //console.log(posible_chord_notes)
  for(var i = 0; i < posible_chord_notes.length; i++){
    var guitar_chord = {"chord":chord, "root_bass":root_bass}
    if(posible_chord_notes[i].note === root_bass.note)continue

    var possible_note = posible_chord_notes[i]
    var possible_note_string = posible_chord_notes[i]
    for(var x = i; x < posible_chord_notes.length; x++){
      if(possible_note.note === posible_chord_notes[x].note && possible_note.distance > posible_chord_notes[x].distance ){
          possible_note = posible_chord_notes[x]
          possible_note_string =  posible_chord_notes[x]
      }
    }
    console.log(possible_note)
    guitar_chord[possible_note.note] = possible_note
    guitar_chord[possible_note.string] = possible_note

    for(var j = 0; j < posible_chord_notes.length; j++){
      if(!(posible_chord_notes[j].note in guitar_chord) && !(posible_chord_notes[j].string in guitar_chord)){

        var other_possible_note = posible_chord_notes[j]
        var other_possible_note_string = posible_chord_notes[j]

        for(var x = j; x < posible_chord_notes.length; x++){
          if(posible_chord_notes[x].note === possible_note.note && !(posible_chord_notes[x].string in guitar_chord) && possible_note.distance > posible_chord_notes[x].distance ){

            other_possible_note = posible_chord_notes[x]
            other_possible_note_string = posible_chord_notes[x]
          }
        }
        //console.log(other_possible_note)
        guitar_chord[other_possible_note.note]  = other_possible_note
        guitar_chord[other_possible_note.string]  = other_possible_note_string
      }
    }
    //console.log(guitar_chord)
    guitar_chords.push(guitar_chord)
  }
  return guitar_chords
}


// NOTE: https://gist.github.com/axelpale/3118596
function k_combinations(set, k) {
	var i, j, combs, head, tailcombs;

	if (k > set.length || k <= 0) {
		return [];
	}


	if (k == set.length) {
		return [set];
	}

	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}

	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {

		head = set.slice(i, i + 1);

		tailcombs = k_combinations(set.slice(i + 1), k - 1);

		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

function compareArrays(array1, array2){

  for(var i = 0; i < array1.length; i++){
    if(array1[i] !== array2[i])return false
  }
  return true
}

function checkForDuplicates(chord, valid_chords){
  var isEqual = false
  valid_chords.map((valid_chord)=>{
    if(compareArrays(chord.chord_validator, valid_chord.chord_validator)){
      //console.log(chord.chord_validator+" "+valid_chord.chord_validator)
      isEqual = true
      return true
    }
  })

  return isEqual
}

function checkForPosibility(chord_validator){
  var num_empty_strings = 0
  var lowest_bar = 14
  var num_lowest_bars = 1

  chord_validator.map((bar)=>{
    if(bar === 0) num_empty_strings += 1
    else if(bar < lowest_bar){
      lowest_bar = bar
    }else if(bar === lowest_bar) num_lowest_bars += 1
  })
  if(num_empty_strings < 3){

    switch (num_empty_strings) {
      case 0:
        //console.log(chord_validator+" num_empty_strings:"+num_empty_strings+"num_lowest_bars:"+num_lowest_bars)
        if(num_lowest_bars <= 3)return false
        break;
      case 1:
        //console.log(chord_validator+" num_empty_strings:"+num_empty_strings+"num_lowest_bars:"+num_lowest_bars)
        if(num_lowest_bars <= 2)return false
        break;
      case 2:
        //console.log(chord_validator+" num_empty_strings:"+num_empty_strings+"num_lowest_bars:"+num_lowest_bars)
        if(num_lowest_bars <= 1)return false
        break;
    }
  }
  return true
}

function findViableChords(chord, posible_guitar_chords_combinations, guitar_chord_validator, root_bass){
  var valid_chords = []

  posible_guitar_chords_combinations.map(function(posible_chord){
    var distance = 0
    var guitar_chord = {chord_validator: [0,0,0,0,0,0]}

    posible_chord.map(function(obj){
      distance += Math.abs(obj.distance)
      if(!(obj.string in guitar_chord)){
        guitar_chord[obj.string] = obj.bar
        guitar_chord.chord_validator[obj.string-1] = parseInt(obj.bar)
        guitar_chord[obj.note] = obj
      }else if(obj.string in guitar_chord && obj.note !== root_bass.note){
        if(guitar_chord[obj.string] === root_bass.note){
          guitar_chord[obj.string] = obj.bar
          guitar_chord.chord_validator[obj.string-1] = parseInt(obj.bar)
          guitar_chord[obj.note] = obj
        }
      }
    })
    if(distance > 6)return true

    for(var i = 0; i < chord.length; i++){
      var note = chord[i]
      if(note.includes("|"))note = note.split("|")[1]
      if(note !== root_bass.note){
        if(!(note in guitar_chord))return true
      }
    }
    guitar_chord[root_bass.string] = root_bass.bar
    guitar_chord.chord_validator[root_bass.string-1] = parseInt(root_bass.bar)
    if(checkForDuplicates(guitar_chord, valid_chords))return true
    if(!checkForPosibility(guitar_chord.chord_validator))return true
    //console.log(guitar_chord.chord_validator)
    valid_chords.push(guitar_chord)
  })


  return valid_chords
}


export function findGuitarChords(chord){

  //var chord = createChord("B",["1", "3", "5", "7b"])
  //console.log(chord)
  console.log(chord)
  var guitar_chord_validator = {"chord":chord}

  for(var i = 0; i < chord.length; i++){
    var note = chord[i]
    if(note.includes("|"))note = note.split("|")[1]
    guitar_chord_validator[note] = false
  }

  var guitar_chords = []
  var root_basses = findChordRootBassPosibilities(chord)

  //console.log(root_basses)
  root_basses.map(function(x){
    var posible_chord_notes = findChordNotesOnGuitar(x, chord, 4)

    //var posible_guitar_chords = findPosibleChords(chord, x, posible_chord_notes, 4)
    var posible_chord_notes_combinations = k_combinations(posible_chord_notes, parseInt(x.string) - 1)

    var viable_guitar_chords = findViableChords(chord, posible_chord_notes_combinations, guitar_chord_validator, x)
    //console.log(x)
    //console.log(viable_guitar_chords)
    guitar_chords.push({root_bass: x, chords: viable_guitar_chords})
  })

  return guitar_chords

}



//findGuitarChords()
