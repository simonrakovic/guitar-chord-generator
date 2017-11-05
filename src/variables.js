var chromatic_scale = ["C","Cis|Db","D","Dis|Eb","E","F","Fis|Gb","G","Gis|Ab","A","Ais|Bb","B"]
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

module.exports = {

  guitar_strings: guitar_strings,
  chromatic_scale: chromatic_scale,
  major_scale: major_scale,
  first_string: first_string,
  second_string: second_string,
  third_string: third_string,
  fourth_string: fourth_string,
  fifth_string: fifth_string,
  sixth_string: sixth_string

}
