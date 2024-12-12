import type ConfigType from '@/common/types/configType'

type InputProps = {
  title: string
  alt?: string
  keyName: keyof ConfigType
  value: string
  placeholder: string
  disabled?: boolean
  handleChange: (value: any, key: keyof ConfigType) => void
}

const InputWrapper = ({
  title,
  alt,
  keyName,
  value,
  placeholder,
  disabled,
  handleChange,
}: InputProps) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">{title}</span>
        {alt && <span className="label-text-alt font-semibold">{alt}</span>}
      </label>
      <input
        className="input input-sm input-bordered font-semibold w-full"
        type="text"
        value={value || ''}
        disabled={!!disabled}
        placeholder={placeholder}
        onChange={(e) => {
          handleChange({ val: e.target.value, required: true }, keyName)
        }}
      />
    </div>
  )
}
export default InputWrapper
