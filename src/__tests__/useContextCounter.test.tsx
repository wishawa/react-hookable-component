/**
 * @jest-environment jsdom
 */
import { createContext, useContext, useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HookablePureComponent } from '..';
type CtxType = {
	count: number;
	increment: () => void;
	decrement: () => void;
};
const TestContext = createContext<CtxType>({
	count: 0,
	increment: () => undefined,
	decrement: () => undefined,
});
function Root() {
	const [count, setCount] = useState(1);
	const value: CtxType = {
		count,
		increment: () => setCount((x) => x + 1),
		decrement: () => setCount((x) => x - 1),
	};
	return (
		<TestContext.Provider value={value}>
			<Consumer />
		</TestContext.Provider>
	);
}
class Consumer extends HookablePureComponent<{}, {}> {
	render() {
		const { count, increment, decrement } = useContext(TestContext);
		return (
			<div>
				<span role="count">count: {count}</span>
				<button onClick={increment}>+</button>
				<button onClick={decrement}>-</button>
			</div>
		);
	}
}
test('counter', async () => {
	render(<Root />);
	expect(screen.getByRole('count')).toHaveTextContent('count: 1');
	const incButton = screen.getByRole('button', { name: '+' });
	fireEvent.click(incButton);
	expect(screen.getByRole('count')).toHaveTextContent('count: 2');
	const decButton = screen.getByRole('button', { name: '-' });
	fireEvent.click(decButton);
	expect(screen.getByRole('count')).toHaveTextContent('count: 1');
});
