import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Dropdown, Input, Segment } from 'semantic-ui-react'
import Header from './Header'
import Account from './Account'
import Transaction, {
  EXPENSE,
  TRANSFER,
  INCOME
} from '../../../entities/Transaction'
import { DropdownOption } from '../../types'
import './index.css'

class TransactionForm extends React.Component {
  onChange = handler => (event, { value }) => handler(value)

  onAccountChange = handler => (event, { value }) => {
    handler({
      accountId: value,
      currency: this.props.accountCurrency[value]
    })
  }

  onTagAdd = (event, { value }) => {
    this.props.addTag({ kind: this.props.form.kind, tag: value })
  }

  getCurrencyOptions = accountId => {
    return this.props.accountCurrency[accountId].map(code => ({
      key: code,
      value: code,
      text: code
    }))
  }

  getGridClassName = () =>
    this.props.form.kind === TRANSFER
      ? 'transaction-form-grid single-line'
      : 'transaction-form-grid'

  render() {
    return (
      <div>
        <Header
          withTransfer={this.props.form.linkedAccountId !== null}
          activeKind={this.props.form.kind}
          changeKind={this.props.changeKind}
        />
        <Segment attached="bottom">
          <Form onSubmit={this.props.onSubmit} className="transaction-form">
            <Account
              label={this.props.form.kind === INCOME ? 'To' : 'From'}
              accountId={this.props.form.accountId}
              amount={this.props.form.amount}
              currency={this.props.form.currency}
              accountOptions={this.props.accountOptions}
              currencyOptions={this.getCurrencyOptions(
                this.props.form.accountId
              )}
              onAccountChange={this.onAccountChange(this.props.changeAccount)}
              onAmountChange={this.onChange(this.props.changeAmount)}
              onCurrencyChange={this.onChange(this.props.changeCurrency)}
            />
            {this.props.form.kind === TRANSFER && (
              <Account
                label="To"
                accountId={this.props.form.linkedAccountId}
                amount={this.props.form.linkedAmount}
                currency={this.props.form.linkedCurrency}
                accountOptions={this.props.accountOptions}
                currencyOptions={this.getCurrencyOptions(
                  this.props.form.linkedAccountId
                )}
                onAccountChange={this.onAccountChange(
                  this.props.changeLinkedAccount
                )}
                onAmountChange={this.onChange(this.props.changeLinkedAmount)}
                onCurrencyChange={this.onChange(
                  this.props.changeLinkedCurrency
                )}
              />
            )}
            <div className={this.getGridClassName()}>
              <div className="transaction-form-grid__column-wide">
                {this.props.form.kind !== TRANSFER && (
                  <div className="transaction-form-grid__field">
                    <Form.Field>
                      <label>Tags</label>
                      <Dropdown
                        multiple
                        selection
                        search
                        allowAdditions
                        closeOnChange
                        placeholder="Choose existing tags or add new"
                        value={this.props.form.tags[this.props.form.kind]}
                        options={this.props.tagsOptions}
                        onChange={this.onChange(this.props.changeTags)}
                        onAddItem={this.onTagAdd}
                      />
                    </Form.Field>
                  </div>
                )}
                <div className="transaction-form-grid__field">
                  <Form.Field>
                    <Input
                      placeholder="Note"
                      value={this.props.form.note}
                      onChange={this.onChange(this.props.changeNote)}
                    />
                  </Form.Field>
                </div>
              </div>
              <div className="transaction-form-grid__column-narrow">
                <div className="transaction-form-grid__field">
                  <Form.Field>
                    <Input
                      required
                      fluid
                      type="date"
                      value={this.props.form.date}
                      onChange={this.onChange(this.props.changeDate)}
                    />
                  </Form.Field>
                </div>
                <div className="transaction-form-grid__field">
                  <Button
                    primary
                    fluid
                    disabled={parseFloat(this.props.form.amount) === 0}
                  >
                    Add {Transaction.kindLabel(this.props.form.kind)}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Segment>
      </div>
    )
  }
}

TransactionForm.propTypes = {
  form: PropTypes.shape({
    kind: PropTypes.oneOf([EXPENSE, TRANSFER, INCOME]),
    accountId: PropTypes.string,
    amount: PropTypes.string.isRequired,
    currency: PropTypes.string.isRequired,
    linkedAccountId: PropTypes.string,
    linkedAmount: PropTypes.string,
    linkedCurrency: PropTypes.string,
    tags: PropTypes.shape({
      [EXPENSE]: PropTypes.arrayOf(PropTypes.string),
      [INCOME]: PropTypes.arrayOf(PropTypes.string)
    }),
    date: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired
  }),
  accountCurrency: PropTypes.object.isRequired,
  accountOptions: PropTypes.arrayOf(DropdownOption).isRequired,
  tagsOptions: PropTypes.arrayOf(DropdownOption),
  changeKind: PropTypes.func.isRequired,
  changeAccount: PropTypes.func.isRequired,
  changeAmount: PropTypes.func.isRequired,
  changeCurrency: PropTypes.func.isRequired,
  changeLinkedAccount: PropTypes.func,
  changeLinkedAmount: PropTypes.func,
  changeLinkedCurrency: PropTypes.func,
  addTag: PropTypes.func,
  changeTags: PropTypes.func,
  changeDate: PropTypes.func.isRequired,
  changeNote: PropTypes.func.isRequired,
  loadTags: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
}

export default TransactionForm