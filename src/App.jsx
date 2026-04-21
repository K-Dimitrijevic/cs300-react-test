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
	persist = true,
	storageKey,
}) => {
	const [baseLabel] = useState(label)
	const [baseInitialRating] = useState(initialRating)
	const resolvedStorageKey =
		storageKey ?? `rating-${baseLabel.toLowerCase().replace(/\s+/g, '-')}`
	const labelStorageKey = `${resolvedStorageKey}-label`
	const [rating, setRating] = useState(() => {
		if (persist) {
			const storedRating = localStorage.getItem(resolvedStorageKey)
			if (storedRating !== null && !Number.isNaN(Number(storedRating))) {
				return Number(storedRating)
			}
		}
		return baseInitialRating
	})
	const [customLabel, setCustomLabel] = useState(() => {
		if (persist) {
			const storedLabel = localStorage.getItem(labelStorageKey)
			if (storedLabel !== null) {
				return storedLabel
			}
		}
		return label
	})

	useEffect(() => {
		if (!persist) return
		localStorage.setItem(resolvedStorageKey, String(rating))
	}, [persist, rating, resolvedStorageKey])

	useEffect(() => {
		if (!persist) return
		localStorage.setItem(labelStorageKey, customLabel)
	}, [customLabel, labelStorageKey, persist])

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
	const productStorageKey = 'rating-product-score'
	const [productRating, setProductRating] = useState(() => {
		const storedRating = localStorage.getItem(productStorageKey)
		if (storedRating !== null && !Number.isNaN(Number(storedRating))) {
			return Number(storedRating)
		}
		return 3
	})
	const [criticRating, setCriticRating] = useState(4)
	const [criticLocked, setCriticLocked] = useState(false)
	const [criticDefaultRating] = useState(4)

	const handleSaveCriticRating = () => {
		setCriticRating(productRating)
		setCriticLocked(true)
	}

	const handleResetCriticRating = () => {
		setCriticRating(criticDefaultRating)
		setCriticLocked(false)
	}

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
					description="Save the product rating here, then it locks as the critic score."
				>
					<div className="demo-actions">
						<button
							className="rating__reset"
							type="button"
							onClick={handleSaveCriticRating}
							disabled={criticLocked}
						>
							Save as critic rating
						</button>
						<button
							className="rating__reset"
							type="button"
							onClick={handleResetCriticRating}
							disabled={!criticLocked}
						>
							Reset critic rating
						</button>
					</div>
					<Rating
						key={`critic-${criticRating}-${criticLocked}`}
						totalStars={5}
						initialRating={criticRating}
						label="Critic score"
						readOnly={criticLocked}
						persist={false}
					/>
					<p className="demo-note">
						{criticLocked
							? 'Critic ratings are locked after saving.'
							: 'Save the product rating to lock it in as the critic score.'}
					</p>
				</DemoCard>
			</div>
		</div>
	)
}

export default App
