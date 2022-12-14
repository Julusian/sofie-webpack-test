import { Meteor } from '../../meteor/meteor'
import { ITranslatableMessage, SomeAction, SomeBlueprintTrigger } from '@sofie-automation/blueprints-integration'
import { ObserveChangesForHash, createMongoCollection } from './lib'
import { registerIndex } from '../database'
import { CollectionName } from '@sofie-automation/corelib/dist/dataModel/Collections'

import { PeripheralDeviceId, ShowStyleBaseId, TriggeredActionId } from '@sofie-automation/corelib/dist/dataModel/Ids'
import { ObjectWithOverrides } from '@sofie-automation/corelib/dist/settings/objectWithOverrides'

export type DBBlueprintTrigger = SomeBlueprintTrigger & {
	deviceId?: PeripheralDeviceId
}

export interface UITriggeredActionsObj {
	_id: TriggeredActionId
	/** Rank number for visually ordering the hotkeys */
	_rank: number

	/** Optional label to specify what this triggered action is supposed to do, a comment basically */
	name?: ITranslatableMessage | string

	/** Id of parent ShowStyleBase. If null, this is a system-wide triggered action */
	showStyleBaseId: ShowStyleBaseId | null

	/** Triggers, with attached device info alongside */
	triggers: Record<string, DBBlueprintTrigger>

	/** A list of actions to execute */
	actions: Record<string, SomeAction>
}

export interface DBTriggeredActions {
	_id: TriggeredActionId
	/** Rank number for visually ordering the hotkeys */
	_rank: number

	/** Optional label to specify what this triggered action is supposed to do, a comment basically */
	name?: ITranslatableMessage | string

	/** Id of parent ShowStyleBase. If null, this is a system-wide triggered action */
	showStyleBaseId: ShowStyleBaseId | null

	/** Identifier given by the blueprints for this document. Set to null if owned by the user */
	blueprintUniqueId: string | null

	/** Triggers, with attached device info alongside */
	triggersWithOverrides: ObjectWithOverrides<Record<string, DBBlueprintTrigger>>

	/** A list of actions to execute */
	actionsWithOverrides: ObjectWithOverrides<Record<string, SomeAction>>

	_rundownVersionHash: string
}

/** Note: Use DBTriggeredActions instead */
export type TriggeredActionsObj = DBTriggeredActions
export const TriggeredActions = createMongoCollection<DBTriggeredActions>(CollectionName.TriggeredActions)

registerIndex(TriggeredActions, {
	showStyleBaseId: 1,
})

Meteor.startup(() => {
	if (Meteor.isServer) {
		ObserveChangesForHash(TriggeredActions, '_rundownVersionHash', [
			'showStyleBaseId',
			'triggersWithOverrides',
			'actionsWithOverrides',
		])
	}
})
