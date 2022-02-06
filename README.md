# React Hookable Component
[<img alt="npm" src="https://img.shields.io/npm/v/react-hookable-component?style=for-the-badge" height="20">](https://www.npmjs.com/package/react-hookable-component)

Use hooks in class-based components.

Simply replace `extends Component` or `extends PureComponent` with `extends HookableComponent` or `extends HookablePureComponent`.
You can then use hooks in the `render()` method.

```tsx
import { HookableComponent } from 'react-hookable-component';

//                                  👇👇👇👇👇👇👇👇
class ComponentThatUsesHook extends HookableComponent<Props, State> {
	render() {
		//            👇👇👇👇👇👇
		const value = useSomeHook();
		return <span>The value is {value}</span>;
	}
}
```

## Limitations

* `UNSAFE_componentWillUpdate` is not called for update triggered via hooks.
* Hooks only work in `render()` method. (But you can save the result to a field in `this` and use that from elsewhere.)
* `render()` must be a class method defined in the prototype.

```tsx
// ✅ This works
class MyComponent extends HookableComponent<Props, State> {
	render() {
		// ...
	}
}

// ❌ This doesn't work
class MyComponent extends HookableComponent<Props, State> {
	render = () => {
		// ...
	}
}

// ❌ This also doesn't work
class MyComponent extends HookableComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.render = () => {
			// ...
		};
	}
}
```

## How It Works
HookableComponent turns your `render()` method into a functional component so hooks work.
The `render()` method still have access to the class instance's `this`.

Want to know more? [The code](https://github.com/wishawa/react-hookable-component/blob/main/src/index.ts) is really short, just go take a look.

## Live Demo
[On CodeSandbox](https://codesandbox.io/s/react-hookable-component-cmfwl)

## Common Use Recipes
### Use contexts in class components
This example shows usage of two React contexts.
```tsx
class MyComponent extends HookableComponent<Props, State> {
	myContextValue: null | TMyContext = null;
	render() {
		// Simply use `useContext`.
		const myContextValue = useContext(MyContext);
		// You can save it to `this` so it can be accessed by other methods later.
		this.myContextValue = myContextValue;

		// Use as many contexts as you want.
		const anotherContextValue = useContext(AnotherContext);
		// ...
	}
}
```
### Memoize computation in class components
This example shows usage of `useMemo`.
```tsx
class MyComponent extends HookablePureComponent<Props, State> {
	expensiveComputation = () => {
		let result = 0;
		for (let i = 0; i < 1000; i++) {
			result += this.props.computationInput;
		}
		return result;
	}
	render() {
		const expensiveAnswer = useMemo(this.expensiveComputation, [this.props.computationInput]);
		return <span>The answer is {expensiveAnswer}</span>;
	}
}
```
## FAQ

#### eslint complains about using hooks in class components.
Do `// eslint-disable-next-line react-hooks/rules-of-hooks`.

#### I'm not extending `Component` or `PureComponent`, but rather my own class.
In that case you can use `makeHookable` instead.
```tsx
import {makeHookable} from 'react-hookable-component';

class MyComponent extends MyCustomComponentClass {
	constructor(props: Props) {
		super(props);
		// ...
		makeHookable(this); // 👈 this right here at the end of constructor!
	}
}
```

#### I don't want to use hooks in class components. I would rather make hooks out of classes!
Use [class-based-react-hooks](https://github.com/wishawa/class-based-react-hooks).