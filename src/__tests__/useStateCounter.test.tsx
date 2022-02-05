/**
 * @jest-environment jsdom
 */
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HookablePureComponent } from '..';
import { Dispatch, SetStateAction, useState } from 'react';

class Counter extends HookablePureComponent<{}, {}> {
	private updater: Dispatch<SetStateAction<number>> | null = null;
	private increment = () => {
		this.updater?.((x) => x + 1);
	};
	private decrement = () => {
		this.updater?.((x) => x - 1);
	};
	render() {
		const [count, setCount] = useState(1);
		this.updater = setCount;
		return (
			<div>
				<span role="count">count: {count}</span>
				<button onClick={this.increment}>+</button>
				<button onClick={this.decrement}>-</button>
			</div>
		);
	}
}
test('counter', async () => {
	render(<Counter />);
	expect(screen.getByRole('count')).toHaveTextContent('count: 1');
	const incButton = screen.getByRole('button', { name: '+' });
	fireEvent.click(incButton);
	expect(screen.getByRole('count')).toHaveTextContent('count: 2');
	const decButton = screen.getByRole('button', { name: '-' });
	fireEvent.click(decButton);
	expect(screen.getByRole('count')).toHaveTextContent('count: 1');
});
