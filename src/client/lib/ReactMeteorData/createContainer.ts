/**
 * Container helper using react-meteor-data.
 */

import { Meteor } from '../../../meteor/meteor'
import { withTracker } from './ReactMeteorData'

let hasDisplayedWarning = false

export function createContainer(options, Component) {
	if (!hasDisplayedWarning && Meteor.isDevelopment) {
		console.warn(
			'Warning: createContainer was deprecated in react-meteor-data@0.2.13. Use withTracker instead.\n' +
				'https://github.com/meteor/react-packages/tree/devel/packages/react-meteor-data#usage'
		)
		hasDisplayedWarning = true
	}

	return withTracker(options)(Component)
}
