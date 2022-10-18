import React from 'react'
import { ContextMenuTrigger } from '@jstarpl/react-contextmenu'
import classNames from 'classnames'
// import { InView } from 'react-intersection-observer'
import { contextMenuHoldToDisplayTime } from '../../lib/lib'
import { ErrorBoundary } from '../../lib/ErrorBoundary'
import { SwitchViewModeButton } from '../SegmentContainer/SwitchViewModeButton'
import { SegmentViewMode } from '../SegmentContainer/SegmentViewModes'
import { PartUi, SegmentUi } from '../SegmentContainer/withResolvedSegment'
import { SegmentNote } from '@sofie-automation/corelib/dist/dataModel/Notes'
import { PartCountdown } from '../RundownView/RundownTiming/PartCountdown'
import { SegmentDuration } from '../RundownView/RundownTiming/SegmentDuration'
import { PartId, SegmentId } from '@sofie-automation/corelib/dist/dataModel/Ids'
import { useTranslation } from 'react-i18next'
import { RundownPlaylist } from '../../../lib/collections/RundownPlaylists'
import { IContextMenuContext } from '../RundownView'
import { NoteSeverity } from '@sofie-automation/blueprints-integration'
import { CriticalIconSmall, WarningIconSmall } from '../../lib/ui/icons/notifications'
import { UIStudio } from '../../../lib/api/studios'

export function SegmentListHeader({
	isDetached,
	isDetachedStick,
	segment,
	parts,
	playlist,
	studio,
	highlight,
	segmentNotes,
	isLiveSegment,
	isNextSegment,
	isQueuedSegment,
	useTimeOfDayCountdowns,
	fixedSegmentDuration,
	showCountdownToSegment,
	hasAlreadyPlayed,
	onSwitchViewMode,
	getSegmentContext,
	onTimeUntilClick,
	onHeaderNoteClick,
}: {
	isDetached: boolean
	isDetachedStick: boolean
	segment: SegmentUi
	playlist: RundownPlaylist
	studio: UIStudio
	parts: Array<PartUi>
	segmentNotes: Array<SegmentNote>
	highlight: boolean
	isLiveSegment: boolean
	isNextSegment: boolean
	isQueuedSegment: boolean
	useTimeOfDayCountdowns: boolean
	hasAlreadyPlayed: boolean
	showCountdownToSegment: boolean
	fixedSegmentDuration: boolean
	onSwitchViewMode?: (newViewMode: SegmentViewMode) => void
	onTimeUntilClick: () => void
	getSegmentContext: () => IContextMenuContext
	onHeaderNoteClick?: (segmentId: SegmentId, level: NoteSeverity) => void
}) {
	const { t } = useTranslation()

	// TODO: This still needs to detect when it should stop being detached, because the original segment is no longer
	// sufficiently in view

	let countdownToPartId: PartId | undefined = undefined
	if (!isLiveSegment) {
		const nextPart = isNextSegment ? parts.find((p) => p.instance._id === playlist.nextPartInstanceId) : parts[0]

		if (nextPart) {
			countdownToPartId = nextPart.instance.part._id
		}
	}

	// function onChange(inView: boolean, entry: IntersectionObserverEntry) {
	// 	const shouldDetach = !inView && parts.length > 1 && entry.boundingClientRect.top < window.innerHeight / 2
	// 	setDetached(shouldDetach)
	// }

	const criticalNotes = segmentNotes.reduce((prev, item) => {
		if (item.type === NoteSeverity.ERROR) return ++prev
		return prev
	}, 0)
	const warningNotes = segmentNotes.reduce((prev, item) => {
		if (item.type === NoteSeverity.WARNING) return ++prev
		return prev
	}, 0)

	const contents = (
		<ContextMenuTrigger
			id="segment-timeline-context-menu"
			collect={getSegmentContext}
			attributes={{
				className: 'segment-opl__title',
			}}
			holdToDisplay={contextMenuHoldToDisplayTime()}
			renderTag="div"
		>
			<div className="segment-opl__counters">
				<div
					className={classNames('segment-opl__duration', {
						hidden: hasAlreadyPlayed && !isLiveSegment && !isNextSegment,
					})}
					tabIndex={0}
				>
					{playlist && parts && parts.length > 0 && (
						<SegmentDuration
							segmentId={segment._id}
							parts={parts}
							label={<span className="segment-timeline__duration__label">{t('Duration')}</span>}
							fixed={fixedSegmentDuration}
						/>
					)}
				</div>
			</div>
			<h2
				id={`segment-name-${segment._id}`}
				className={'segment-opl__title__label' + (segment.identifier ? ' identifier' : '')}
				data-identifier={segment.identifier}
			>
				{segment.name}
			</h2>
			<div className="segment-opl__counters">
				<div
					className={classNames('segment-opl__timeUntil', {
						'segment-opl__timeUntil--time-of-day': useTimeOfDayCountdowns,
					})}
					onClick={onTimeUntilClick}
				>
					{playlist && parts && parts.length > 0 && showCountdownToSegment && (
						<PartCountdown
							partId={countdownToPartId}
							hideOnZero={!useTimeOfDayCountdowns}
							useWallClock={useTimeOfDayCountdowns}
							playlist={playlist}
							label={
								useTimeOfDayCountdowns ? (
									<span className="segment-timeline__timeUntil__label">{t('On Air At')}</span>
								) : (
									<span className="segment-timeline__timeUntil__label">{t('On Air In')}</span>
								)
							}
						/>
					)}
					{studio.settings.preserveUnsyncedPlayingSegmentContents && segment.orphaned && (
						<span className="segment-timeline__unsynced">{t('Unsynced')}</span>
					)}
				</div>
			</div>
			{(criticalNotes > 0 || warningNotes > 0) && (
				<div className="segment-opl__notes">
					{criticalNotes > 0 && (
						<div
							className="segment-timeline__title__notes__note segment-timeline__title__notes__note--critical"
							onClick={() => onHeaderNoteClick && onHeaderNoteClick(segment._id, NoteSeverity.ERROR)}
							aria-label={t('Critical problems')}
						>
							<CriticalIconSmall />
							<div className="segment-timeline__title__notes__count">{criticalNotes}</div>
						</div>
					)}
					{warningNotes > 0 && (
						<div
							className="segment-timeline__title__notes__note segment-timeline__title__notes__note--warning"
							onClick={() => onHeaderNoteClick && onHeaderNoteClick(segment._id, NoteSeverity.WARNING)}
							aria-label={t('Warnings')}
						>
							<WarningIconSmall />
							<div className="segment-timeline__title__notes__count">{warningNotes}</div>
						</div>
					)}
				</div>
			)}
			<ErrorBoundary>
				<SwitchViewModeButton currentMode={SegmentViewMode.List} onSwitchViewMode={onSwitchViewMode} />
			</ErrorBoundary>
		</ContextMenuTrigger>
	)

	return (
		// <InView threshold={1} rootMargin={`-${getHeaderHeight()}px 0px 0px 0px`} onChange={onChange} as="div">
		<>
			{contents}
			{isDetached && (
				<div
					className={classNames('segment-opl__title-float-parent dark', {
						live: isLiveSegment,
						next: !isLiveSegment && isNextSegment,
						queued: isQueuedSegment,
						stick: isDetachedStick,

						'has-played': hasAlreadyPlayed && !isLiveSegment && !isNextSegment,

						'invert-flash': highlight,

						'time-of-day-countdowns': useTimeOfDayCountdowns,
					})}
				>
					{contents}
				</div>
			)}
		</>
		// </InView>
	)
}
