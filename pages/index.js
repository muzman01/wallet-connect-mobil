import { Web3Button, Web3NetworkSwitch, useWeb3Modal } from '@web3modal/react'
import CustomButton from '../components/CustomButton'
import { useSignMessage, useAccount } from 'wagmi'
import { verifyMessage } from 'ethers/lib/utils'

import { useRef } from 'react'

export default function HomePage() {
  const recoveredAddress = useRef()
  const { open } = useWeb3Modal()
  const { isConnected, address } = useAccount()
  const { data, error, isLoading, signMessage } = useSignMessage({
    onSuccess(data, variables) {
      console.log('data', data)
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  })
  return (
    <>
      {/* Predefined button  */}
      <Web3Button icon="show" label="Connect Wallet" balance="show" />
      <br />

      {/* Network Switcher Button */}
      <Web3NetworkSwitch />
      <br />

      {/* Custom button */}
      <CustomButton />
      {isConnected && <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target)
          const message = formData.get('message')
          signMessage({ message })
        }}
      >
        <label htmlFor="message">Enter a message to sign</label>
        <textarea
          id="message"
          name="message"
          placeholder="The quick brown fox…"
        />
        <button disabled={isLoading}>
          {isLoading ? 'Check Wallet' : 'Sign Message'}
        </button>

        {data && (
          <div>
            <div>Recovered Address: {recoveredAddress.current}</div>
            <div>Signature: {data}</div>
          </div>
        )}

        {error && <div>{error.message}</div>}
      </form>}
    </>
  )
}