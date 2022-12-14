import * as React from 'react'
import { NoticeLevel } from '../notifications/notifications'
import { CriticalIconSmall, WarningIconSmall } from './icons/notifications'

export interface IProps {
	noticeLevel: NoticeLevel
}

export function PieceStatusIcon(props: IProps) {
	return (
		<div className="piece__status-icon">
			{props.noticeLevel === NoticeLevel.CRITICAL ? (
				<CriticalIconSmall />
			) : props.noticeLevel === NoticeLevel.WARNING ? (
				<WarningIconSmall />
			) : null}
		</div>
	)
}
