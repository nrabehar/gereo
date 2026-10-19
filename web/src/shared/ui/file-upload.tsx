import { CircleAlertIcon, FileIcon, UploadIcon, XIcon } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'

import { cn } from '$/cn'

type FileUploadProps = {
	onFilesChange?: (files: File[]) => void
	accept?: string
	multiple?: boolean
	maxSize?: number
	label?: string
	info?: ReactNode
	error?: ReactNode
	disabled?: boolean
	required?: boolean
	name?: string
	id?: string
	locale?: string
	className?: string
}

const matchesAccept = (file: File, accept: string | undefined) => {
	if (!accept) {
		return true
	}

	return accept
		.split(',')
		.map((rule) => rule.trim().toLowerCase())
		.filter(Boolean)
		.some((rule) => {
			if (rule.startsWith('.')) {
				return file.name.toLowerCase().endsWith(rule)
			}

			if (rule.endsWith('/*')) {
				return file.type.toLowerCase().startsWith(rule.slice(0, -1))
			}

			return file.type.toLowerCase() === rule
		})
}

const formatSize = (bytes: number, locale: string) => {
	const units = ['B', 'KB', 'MB', 'GB']
	let size = bytes
	let unit = 0

	while (size >= 1024 && unit < units.length - 1) {
		size /= 1024
		unit += 1
	}

	return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(size)} ${units[unit]}`
}

export const FileUpload = ({
	onFilesChange,
	accept,
	multiple = false,
	maxSize,
	label,
	info,
	error,
	disabled,
	required,
	name,
	id,
	locale = 'fr-FR',
	className,
}: FileUploadProps) => {
	const generatedId = useId()
	const inputId = id ?? generatedId
	const messageId = `${inputId}-message`
	const inputRef = useRef<HTMLInputElement>(null)
	const [files, setFiles] = useState<File[]>([])
	const [rejected, setRejected] = useState<string[]>([])
	const [dragging, setDragging] = useState(false)

	const shownError = error || (rejected.length > 0 ? rejected.join(' ') : null)
	const message = shownError || info

	const commit = (next: File[]) => {
		setFiles(next)
		onFilesChange?.(next)
	}

	const addFiles = (incoming: File[]) => {
		const problems: string[] = []
		const accepted: File[] = []

		for (const file of incoming) {
			if (!matchesAccept(file, accept)) {
				problems.push(`${file.name}: file type not allowed.`)
			} else if (maxSize !== undefined && file.size > maxSize) {
				problems.push(`${file.name}: larger than ${formatSize(maxSize, locale)}.`)
			} else {
				accepted.push(file)
			}
		}

		setRejected(problems)

		if (accepted.length > 0) {
			commit(multiple ? [...files, ...accepted] : accepted.slice(0, 1))
		}
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		addFiles(Array.from(event.target.files ?? []))
		event.target.value = ''
	}

	const remove = (index: number) => {
		commit(files.filter((_, position) => position !== index))
		inputRef.current?.focus()
	}

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			{label && (
				<span className="text-sm leading-none font-medium">
					{label}
					{required && (
						<span
							aria-hidden="true"
							className="text-destructive ml-0.5 dark:text-red-400"
						>
							*
						</span>
					)}
				</span>
			)}
			<label
				htmlFor={inputId}
				className={cn(
					'relative border-muted-foreground/70 bg-background hover:border-muted-foreground hover:bg-muted/50 has-focus-visible:outline-foreground flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-[border-color,background-color] duration-150 ease-out-strong has-focus-visible:outline-2 has-focus-visible:outline-offset-2',
					dragging && 'border-primary bg-primary/10',
					shownError && 'border-destructive',
					disabled && 'cursor-not-allowed opacity-50 hover:bg-background',
				)}
			>
				<input
					ref={inputRef}
					id={inputId}
					type="file"
					name={name}
					accept={accept}
					multiple={multiple}
					disabled={disabled}
					required={required}
					aria-label={label}
					aria-invalid={shownError ? true : undefined}
					aria-describedby={message ? messageId : undefined}
					onChange={handleChange}
					onDragEnter={() => setDragging(true)}
					onDragLeave={() => setDragging(false)}
					onDrop={() => setDragging(false)}
					className="absolute inset-0 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
				/>
				<span className="bg-muted text-muted-foreground ring-border grid size-10 place-items-center rounded-full ring-1 ring-inset">
					<UploadIcon aria-hidden="true" className="size-4" />
				</span>
				<span className="text-sm">
					<span className="font-medium underline underline-offset-4">Choose a file</span>
					<span className="text-muted-foreground"> or drag it here</span>
				</span>
				{(accept || maxSize !== undefined) && (
					<span className="text-muted-foreground text-xs">
						{[
							accept,
							maxSize !== undefined ? `max ${formatSize(maxSize, locale)}` : null,
						]
							.filter(Boolean)
							.join(' · ')}
					</span>
				)}
			</label>
			{files.length > 0 && (
				<ul className="flex flex-col gap-1.5">
					{files.map((file, index) => (
						<li
							key={`${file.name}-${file.size}-${file.lastModified}`}
							className="border-border bg-card flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
						>
							<FileIcon
								aria-hidden="true"
								className="text-muted-foreground size-4 shrink-0"
							/>
							<span className="flex-1 truncate">{file.name}</span>
							<span className="text-muted-foreground text-xs tabular-nums">
								{formatSize(file.size, locale)}
							</span>
							<button
								type="button"
								aria-label={`Remove ${file.name}`}
								onClick={() => remove(index)}
								className="text-muted-foreground hover:text-foreground hover:bg-muted active:bg-accent focus-visible:outline-foreground -m-1 grid size-7 shrink-0 cursor-pointer place-items-center rounded-md transition-[color,background-color,scale] duration-150 ease-out-strong select-none focus-visible:outline-2 motion-safe:active:scale-95"
							>
								<XIcon aria-hidden="true" className="size-4" />
							</button>
						</li>
					))}
				</ul>
			)}
			{shownError ? (
				<p
					id={messageId}
					role="alert"
					className="text-destructive flex items-start gap-1.5 text-xs font-medium text-pretty transition-opacity duration-150 ease-out-strong starting:opacity-0 dark:text-red-400"
				>
					<CircleAlertIcon aria-hidden="true" className="mt-px size-3.5 shrink-0" />
					{shownError}
				</p>
			) : (
				info && (
					<p
						id={messageId}
						className="text-muted-foreground text-xs text-pretty transition-opacity duration-150 ease-out-strong starting:opacity-0"
					>
						{info}
					</p>
				)
			)}
		</div>
	)
}
