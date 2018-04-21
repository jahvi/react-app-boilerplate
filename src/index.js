import React from 'react';
import { render } from 'react-dom';

import s from './styles.css';

const App = () => <h1 className={s.title}>Hello World</h1>;

render(<App />, document.getElementById('root'));
