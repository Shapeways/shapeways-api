### Tests for Models /model ###

describe 'upload a model', ->
  it 'should accept a valid .stl file'

  it 'should display an error when an invalid model is specified'
  
  it 'should receive a successful response from the server when a valid model is uplaoded '
  
describe 'edit a model', ->
  
describe 'view a list of models', ->
  it 'should return a list of models when no parameter is specified'
  
  it 'should list private models'
  
  it 'should list public models'
  
describe 'view model by id', ->
  it 'should return a single model'
  
  it 'should return null when an invalid model is specified'
  
  
### Usage 
describe('test', function(){
  it('should work with objects', function(){
    var a = { name: 'tobi', age: 2, species: 'ferret' };
    var b = { name: 'jane', age: 8, species: 'ferret' };
    a.should.eql(b);
  })

  it('should work with arrays', function(){
    var a = [1,2,{ name: 'tobi' },4,5]
    var b = [1,2,{ name: 'jane' },4,4, 'extra stuff', 'more extra']
    a.should.eql(b);
  })

  it('should work with strings', function(){
    'some\nfoo\nbar'.should.equal('some\nbar\nbaz');
  })
})

###