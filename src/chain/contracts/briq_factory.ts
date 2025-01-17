import type { AccountInterface, Provider } from 'starknet';
import { Contract, FunctionAbi } from 'starknet';
import { number, uint256 } from 'starknet';

import BriqFactoryABI from './starknet-testnet/briq_factory.json';
import { maybeStore } from '../WalletLoading';
import type ERC20Contract from './erc20';
import { getProvider } from '../BlockchainProvider';

export default class BriqContract {
    contract!: Contract;
    constructor(address: string, provider: Provider) {
        this.connect(address, provider);
    }

    connect(address: string, provider: Provider) {
        this.contract = new Contract(BriqFactoryABI as FunctionAbi[], address, provider);
    }
    getAddress() {
        return this.contract.address;
    }

    async getParameters() {
        const provider = getProvider().value!;

        const current_t = (await provider.provider!.callContract(this.contract.populateTransaction.get_current_t())).result[0] as string;
        const surge_t = (await provider.provider!.callContract(this.contract.populateTransaction.get_surge_t())).result[0] as string;

        return {
            current_t,
            surge_t,
        }
    }

    buyTransaction(erc20_contract: ERC20Contract, amount: number, approval: number.BigNumberish) {
        return [
            erc20_contract.contract.populateTransaction['approve'](this.contract.address, uint256.bnToUint256(number.toBN(approval))),
            this.contract.populateTransaction.buy(`${amount}`),
            erc20_contract.contract.populateTransaction['approve'](this.contract.address, uint256.bnToUint256(number.toBN(0))),
        ]
    }

    async buy(erc20_contract: ERC20Contract, amount: number, approval: number.BigNumberish) {
        await maybeStore.value!.ensureEnabled();
        return await (this.contract.providerOrAccount as AccountInterface).execute(this.buyTransaction(erc20_contract, amount, approval));
    }
}
