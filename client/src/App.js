
import Authentication from './components/Authentication';
import GrayScaleConverter from './components/GrayScaleConverter';
import TextFileUpperCase from './components/TextFileUpperCase';

const App = () => {

  return (
    <div style={{textAlign: 'center'}}>
      <Authentication />
      <GrayScaleConverter />
      <TextFileUpperCase />
    </div>
  );
};

export default App;
