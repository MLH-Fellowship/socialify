import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

import { DEFAULT_CONFIG } from '@/common/configHelper'
import type { RepoQueryResponse } from '@/common/github/repoQuery'
import type ConfigType from '@/common/types/configType'
import Config from '@/src/components/configuration/config'
import Preview from '@/src/components/preview/preview'
import toast from '@/src/components/toaster'
import ConfigContext from '@/src/contexts/ConfigContext'

type MainWrapperProps = {
  response: RepoQueryResponse
}

const MainWrapper = ({ response }: MainWrapperProps) => {
  const router = useRouter()
  const [config, setConfig] = useState<ConfigType>(DEFAULT_CONFIG)

  const setConfigHelper = (config: ConfigType) => {
    setConfig(config)
  }

  useEffect(() => {
    if (!response || !response.repository) {
      router.push('/')
      toast.error('Please enter a valid GitHub repository.')
    }
  }, [response, router])

  if (response && response.repository) {
    const { repository } = response

    return (
      <ConfigContext.Provider value={{ config, setConfig: setConfigHelper }}>
        <div className="flex flex-col lg:flex-row w-full justify-center items-center lg:justify-evenly">
          <div className="hero w-fit">
            <Preview />
          </div>
          <div className="hero w-fit">
            <Config repository={repository} />
          </div>
        </div>
      </ConfigContext.Provider>
    )
  } else {
    return null
  }
}
export default MainWrapper
