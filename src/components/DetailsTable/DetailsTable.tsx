import { useContext } from 'react'
import { AppContext } from '../../context/GlobalState'
import './DetailsTable.css'

const DetailsTable: React.FC = () => {
  const context = useContext(AppContext)

  if (!context) {
    return <div>Error: Context is not available.</div>
  }

  const { state } = context

  return (
    <table className="details-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Question</th>
          <th>Response</th>
        </tr>
      </thead>
      <tbody>
        {state.IsHero.map((question) => (
          <tr key={question.id}>
            <td>{question.id}</td>
            <td>{question.question}</td>
            <td>{question.answer || "No answer yet"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default DetailsTable
