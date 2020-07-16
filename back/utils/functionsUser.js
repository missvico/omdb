const validatePassword = function(password){
    let arrMayus = []    
    let arrMinus = []
    let arrNumbers = []
    let validateMayus, validateMinus, validateNumbers
    for(let i=65; i<91; i++){
      arrMayus.push(String.fromCharCode(i))
      arrMinus.push(String.fromCharCode(i+32))
    }
    for(let i=0; i<=9; i++){
      arrNumbers.push(i.toString())
    }
    validateMayus = includesArray(arrMayus, password)
    validateMinus = includesArray(arrMinus, password)
    validateNumbers = includesArray(arrNumbers, password)
    return validateMayus && validateMinus && validateNumbers
  }
  
  const includesArray = function(array, string) {
    for(let i=0; i<array.length; i++){
      if(string.includes(array[i])) return true
    }
    return false
  }

module.exports = {validatePassword}