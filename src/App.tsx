import './App.scss';

function App() {
  return (
    <div className="App">
      <div className="input-container">
        <label htmlFor="city">City:</label>
        <input type="text" name="city" id="city" />
        <button>Submit</button>
      </div>
    </div>
  );
}

export default App;
