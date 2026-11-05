'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { uiCopy } from '@/config/ui-copy'
import { compressImage } from '@/lib/image-compression'
import type { IncidentPhoto } from '@/types/incident'
import { FieldError } from '@/components/atoms/field-error'
import { Button } from '@/components/ui/button'

interface PhotoFieldProps {
  value?: IncidentPhoto
  onChange: (photo?: IncidentPhoto) => void
  hint: string
}

export function PhotoField({ value, onChange, hint }: PhotoFieldProps) {
  const copy = uiCopy.report
  const inputRef = useRef<HTMLInputElement>(null)
  const [working, setWorking] = useState(false)
  const [failed, setFailed] = useState(false)

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setFailed(false)
    setWorking(true)
    try {
      onChange(await compressImage(file))
    } catch {
      setFailed(true)
    } finally {
      setWorking(false)
    }
  }

  function remove() {
    onChange(undefined)
    setFailed(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <p id="photo-hint" className="text-base leading-snug text-muted-foreground">
        {hint}
      </p>
      <label className="relative inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 self-start rounded-xl border-2 border-border bg-card px-4 text-base font-semibold has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/50">
        {working ? copy.compressing : copy.takePhoto}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          disabled={working}
          aria-describedby="photo-hint"
          onChange={(event) => void handleChange(event)}
          className="sr-only"
        />
      </label>
      <FieldError id="photo-error" message={failed ? copy.photoError : undefined} />
      {value && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value.dataUrl} width={value.width} height={value.height} alt={copy.photoAlt} className="h-auto w-full rounded-2xl" />
          <Button type="button" variant="outline" size="touch" onClick={remove} className="self-start">
            {copy.removePhoto}
          </Button>
        </>
      )}
    </div>
  )
}
