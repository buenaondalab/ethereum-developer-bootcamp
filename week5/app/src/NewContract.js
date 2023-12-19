export default function NewContract ({factory, deployAction}){
    return (
        <div className="contract">
          <div className="factory">
            <label>Contract Factory:<br/>{factory}</label>
          </div>
          <h1> New Contract</h1>
          <label>
            Arbiter Address
            <input type="text" id="arbiter" />
          </label>

          <label>
            Beneficiary Address
            <input type="text" id="beneficiary" />
          </label>

          <label>
            Deposit Amount (ETH)
            <input type="text" id="wei" />
          </label>

          <div
            className="button"
            id="deploy"
            onClick={deployAction}
          >
            Deploy
          </div>
      </div>
    )
}