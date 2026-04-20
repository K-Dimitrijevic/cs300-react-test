import { useEffect, useState } from 'react'
import './App.css'

const Star = ({ filled, onSelect, readOnly, label }) => (
	<button
		className={`star ${filled ? 'is-filled' : ''}`}
		type="button"
		onClick={readOnly ? undefined : onSelect}
		aria-label={label}
		disabled={readOnly}
	>
		<span aria-hidden="true">★</span>
	</button>
)

const Rating = ({
	totalStars = 5,
	initialRating = 0,
	onRatingChange = () => {},
	readOnly = false,
	label = 'Rating',
}) => {
		const storageKey = `rating-${label.toLowerCase().replace(/\s+/g, '-')}`
		const [rating, setRating] = useState(() => {
			const storedRating = localStorage.getItem(storageKey)
			if (storedRating !== null && !Number.isNaN(Number(storedRating))) {
				return Number(storedRating)
			}
			return initialRating
		})
	const [customLabel, setCustomLabel] = useState(label)

	useEffect(() => {
		localStorage.setItem(storageKey, String(rating))
	}, [rating, storageKey])

	const handleSelect = (value) => {
		if (readOnly) return
		setRating(value)
		onRatingChange(value)
	}

	const displayLabel = customLabel.trim() || label

	return (
		<div className={`rating ${readOnly ? 'is-read-only' : ''}`}>
			<div className="rating__header">
				<span className="rating__label">{displayLabel}</span>
				<span className="rating__value">
					{rating}/{totalStars}
				</span>
			</div>
			<div className="rating__stars" role="radiogroup" aria-label={displayLabel}>
				{Array.from({ length: totalStars }, (_, index) => {
					const value = index + 1
					return (
						<Star
							key={value}
							filled={value <= rating}
							onSelect={() => handleSelect(value)}
							readOnly={readOnly}
							label={`${value} ${value === 1 ? 'star' : 'stars'}`}
						/>
					)
				})}
			</div>
			<div className="rating__controls">
				<label className="rating__input">
					Custom label
					<input
						type="text"
						value={customLabel}
						onChange={(event) => setCustomLabel(event.target.value)}
						disabled={readOnly}
						placeholder="Add a label"
					/>
				</label>
				<button
					className="rating__reset"
					type="button"
					onClick={() => handleSelect(0)}
					disabled={readOnly}
				>
					Clear
				</button>
			</div>
		</div>
	)
}

const DemoCard = ({ title, description, children }) => (
	<section className="demo-card">
		<header>
			<h2>{title}</h2>
			<p>{description}</p>
		</header>
		<div className="demo-card__content">{children}</div>
	</section>
)

const App = () => {
	const [productRating, setProductRating] = useState(3)

	return (
		<div className="app">
			<header className="page-header">
				<h1>Rating Component</h1>
				<p>
					Compare two rating setups: a fully interactive product score and a
					read-only critic rating.
				</p>
			</header>

			<div className="demo-grid">
				<DemoCard
					title="Interactive product rating"
					description="Click the stars or update the label to save your pick in localStorage."
				>
					<Rating
						totalStars={5}
						initialRating={productRating}
						label="Product score"
						onRatingChange={setProductRating}
					/>
					<p className="demo-note">Last saved rating: {productRating}</p>
				</DemoCard>

				<DemoCard
					title="Read-only critic rating"
					description="This configuration shows a 10-star scale with input disabled."
				>
					<Rating
						totalStars={10}
						initialRating={8}
						label="Critic score"
						readOnly
					/>
					<p className="demo-note">Critic ratings stay fixed for visitors.</p>
				</DemoCard>
			</div>
		</div>
	)
}

export default App
