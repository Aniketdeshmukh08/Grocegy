import {render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import App from './App';
import SecureFooter from './components/shared/SecureFooter';

test('Render App', () => {
    render(<App/>);
    const appElem = screen.getByText(/Hello/i);
    expect(appElem).toBeInTheDocument();
})