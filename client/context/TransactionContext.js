import React, { useEffect, useState } from 'react'
import {contractABI, contractAddress} from '../lib/constants'
import { ethers } from 'ethers'
import { client } from '../lib/sanityClient'

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined'){
    eth = window.ethereum
}

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    )
  
    return transactionContract
  }

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState()
    const [IsLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        addressTo: '',
        amount: ''
    })

    useEffect (() => {
        checkIfWalletIsConnected();
    }, [])
   
    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask ')
    
            const accounts = await metamask.request({ method: 'eth_requestAccounts' })
      
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.error(error)
            throw new Error('No ethereum object.')
        }
    }

    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
          if (!metamask) return alert('Please install metamask ')
    
          const accounts = await metamask.request({ method: 'eth_accounts' })
    
          if (accounts.length) {
            setCurrentAccount(accounts[0])
            console.log('wallet is already connected!');
          }
        } catch (error) {
          console.error(error)
          throw new Error('No ethereum object.')
        }
    }

    const sendTransaction = async (
        metamask = eth,
        connectedAccount = currentAccount,
    ) => {
        try {
            if (!metamask) return alert("PLease install metmask");
            const { addressTo, amount } = formData
            const transactionContract = getEthereumContract()

            const parsedAmount = ethers.utils.parseEther(amount)

            await metamask.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: connectedAccount,
                    to: addressTo,
                    gas: '0x7EF48',
                    value: parsedAmount._hex,
                    },
                ]
            })

            const transactionHash = await transactionContract.publishTransaction(
                addressTo,
                parsedAmount,
                `Transferring ETH ${parsedAmount} to ${addressTo}`,
                'TRANSFER',
            )

            setIsLoading(true)

            await transactionHash.wait()

            await saveTransaction(
                transactionHash.hash,
                amount,
                connectedAccount,
                addressTo,
            )

            setIsLoading(false)
        
        } catch (error) {
            console.log(error)
        }
    }

    const handleChange = (e, name) => {
        setFormData(prevState => ({...prevState, [name]: e.target.value}))
    }

    const saveTransaction = async (
        txHash,
        amount,
        fromAddress = currentAccount,
        toAddress,
      ) => {
        const txDoc = {
          _type: 'transactions',
          _id: txHash,
          fromAddress: fromAddress,
          toAddress: toAddress,
          timestamp: new Date(Date.now()).toISOString(),
          txHash: txHash,
          amount: parseFloat(amount),
        }
    
        await client.createIfNotExists(txDoc)
    
        await client
          .patch(currentAccount)
          .setIfMissing({ transactions: [] })
          .insert('after', 'transactions[-1]', [
            {
              _key: txHash,
              _ref: txHash,
              _type: 'reference',
            },
          ])
          .commit()
    
        return
    }

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                connectWallet,
                sendTransaction,
                handleChange,
                formData,
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}

