import React from 'react'
import _ from 'underscore'
import { Translated, translateWithTracker } from '../../lib/ReactMeteorData/react-meteor-data'

import { DashboardPanelUnit } from '../../../lib/collections/RundownLayouts'
import { IAdLibPanelProps, AdLibFetchAndFilterProps, fetchAndFilter } from './AdLibPanel'
import {
	AdLibPieceUi,
	getNextPieceInstancesGrouped,
	getUnfinishedPieceInstancesGrouped,
	isAdLibNext,
} from '../../lib/shelf'
import { OutputLayers, SourceLayers } from '@sofie-automation/corelib/dist/dataModel/ShowStyleBase'
import { UIStudio } from '../../../lib/api/studios'
import { UIStudios } from '../Collections'
import { Meteor } from '../../../meteor/meteor'
import { PieceId } from '@sofie-automation/corelib/dist/dataModel/Ids'
import { DashboardPanelInner } from './DashboardPanelInner'

export interface IState {
	outputLayers: OutputLayers
	sourceLayers: SourceLayers
	searchFilter: string | undefined
	selectedAdLib?: AdLibPieceUi
	singleClickMode: boolean
}

export interface IDashboardPanelProps {
	searchFilter?: string | undefined
	mediaPreviewUrl?: string
	shouldQueue: boolean
}

export interface IDashboardPanelTrackedProps {
	studio: UIStudio | undefined
	unfinishedAdLibIds: PieceId[]
	unfinishedTags: string[]
	nextAdLibIds: PieceId[]
	nextTags: string[]
}

interface DashboardPositionableElement {
	x: number
	y: number
	width: number
	height: number
	scale?: number
	xUnit?: DashboardPanelUnit
	yUnit?: DashboardPanelUnit
	widthUnit?: DashboardPanelUnit
	heightUnit?: DashboardPanelUnit
}

export type AdLibPieceUiWithNext = AdLibPieceUi & { isNext: boolean }

function getVerticalOffsetFromHeight(el: DashboardPositionableElement) {
	return el.height < 0
		? el.heightUnit === DashboardPanelUnit.PERCENT
			? `calc(${-1 * el.height}% + var(--dashboard-panel-margin-height) / 2))`
			: `calc(${-1 * el.height - 1} * var(--dashboard-button-grid-height))`
		: undefined
}

function getHorizontalOffsetFromWidth(el: DashboardPositionableElement) {
	return el.width < 0
		? el.widthUnit === DashboardPanelUnit.PERCENT
			? `calc(${-1 * el.width}% + var(--dashboard-panel-margin-width) / 2))`
			: `calc(${-1 * el.width - 1} * var(--dashboard-button-grid-width))`
		: undefined
}

export function dashboardElementStyle(el: DashboardPositionableElement): React.CSSProperties {
	return {
		width:
			el.width >= 0
				? el.widthUnit === DashboardPanelUnit.PERCENT
					? `calc(${el.width}% - var(--dashboard-panel-margin-width))`
					: `calc((${el.width} * var(--dashboard-button-grid-width)) + var(--dashboard-panel-margin-width))`
				: undefined,
		height:
			el.height >= 0
				? el.heightUnit === DashboardPanelUnit.PERCENT
					? `calc(${el.height}% - var(--dashboard-panel-margin-height))`
					: `calc((${el.height} * var(--dashboard-button-grid-height)) + var(--dashboard-panel-margin-height))`
				: undefined,
		left:
			el.x >= 0
				? el.xUnit === DashboardPanelUnit.PERCENT
					? `calc(${el.x}% + var(--dashboard-panel-margin-width) / 2)`
					: `calc(${el.x} * var(--dashboard-button-grid-width))`
				: getHorizontalOffsetFromWidth(el),
		top:
			el.y >= 0
				? el.yUnit === DashboardPanelUnit.PERCENT
					? `calc(${el.y}% + var(--dashboard-panel-margin-height) / 2)`
					: `calc(${el.y} * var(--dashboard-button-grid-height))`
				: getVerticalOffsetFromHeight(el),
		right:
			el.x < 0
				? el.xUnit === DashboardPanelUnit.PERCENT
					? `calc(${-1 * el.x}% + var(--dashboard-panel-margin-width) / 2)`
					: `calc(${-1 * el.x - 1} * var(--dashboard-button-grid-width))`
				: getHorizontalOffsetFromWidth(el),
		bottom:
			el.y < 0
				? el.yUnit === DashboardPanelUnit.PERCENT
					? `calc(${-1 * el.y}% + var(--dashboard-panel-margin-height) / 2)`
					: `calc(${-1 * el.y - 1} * var(--dashboard-button-grid-height))`
				: getVerticalOffsetFromHeight(el),

		// @ts-expect-error css variables
		'--dashboard-panel-scale': el.scale || 1,
		'--dashboard-panel-scaled-font-size': (el.scale || 1) * 1.5 + 'em',
	}
}

export function findNext(
	nextAdLibIds: IDashboardPanelTrackedProps['nextAdLibIds'],
	unfinishedTags: IDashboardPanelTrackedProps['unfinishedTags'],
	nextTags: IDashboardPanelTrackedProps['nextTags'],
	adLibs: AdLibPieceUi[],
	nextInCurrentPart: boolean,
	oneNextPerSourceLayer: boolean
): Array<AdLibPieceUi & { isNext: boolean }> {
	const nextAdlibs: Set<PieceId> = new Set()
	const nextAdlibsPerLayer: Map<string, PieceId> = new Map()
	const checkAndSet = (adLib: AdLibPieceUi) => {
		if (oneNextPerSourceLayer) {
			if (nextAdlibsPerLayer.has(adLib.sourceLayerId)) {
				return
			} else {
				nextAdlibsPerLayer.set(adLib.sourceLayerId, adLib._id)
			}
		}
		nextAdlibs.add(adLib._id)
	}
	adLibs.forEach((adLib) => {
		if (isAdLibNext(nextAdLibIds, nextTags, adLib)) {
			checkAndSet(adLib)
		}
	})
	if (nextInCurrentPart) {
		adLibs.forEach((adLib) => {
			if (adLib.nextPieceTags && adLib.nextPieceTags.every((tag) => unfinishedTags.includes(tag))) {
				checkAndSet(adLib)
			}
		})
	}
	return adLibs.map((adLib) => {
		return {
			...adLib,
			isNext: nextAdlibs.has(adLib._id),
		}
	})
}

export const DashboardPanel = translateWithTracker<
	Translated<IAdLibPanelProps & IDashboardPanelProps>,
	IState,
	AdLibFetchAndFilterProps & IDashboardPanelTrackedProps
>(
	(props: Translated<IAdLibPanelProps>) => {
		const studio = UIStudios.findOne(props.playlist.studioId)
		if (!studio) throw new Meteor.Error(404, 'Studio "' + props.playlist.studioId + '" not found!')

		const { unfinishedAdLibIds, unfinishedTags } = getUnfinishedPieceInstancesGrouped(
			props.playlist,
			props.showStyleBase
		)
		const { nextAdLibIds, nextTags } = getNextPieceInstancesGrouped(props.playlist, props.showStyleBase)
		return {
			...fetchAndFilter(props),
			studio,
			unfinishedAdLibIds,
			unfinishedTags,
			nextAdLibIds,
			nextTags,
		}
	},
	(_data, props: IAdLibPanelProps, nextProps: IAdLibPanelProps) => {
		return !_.isEqual(props, nextProps)
	}
)(DashboardPanelInner)
