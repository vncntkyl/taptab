import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label, TextInput, Button } from "flowbite-react";
function Create() {
  const [form, setForm] = useState({
    name: "",
    position: "",
    level: "",
  });
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };

    await fetch("http://localhost:5050/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    }).catch((error) => {
      window.alert(error);
      return;
    });

    setForm({ name: "", position: "", level: "" });
    navigate("/");
  }
  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        {Object.keys(form).map((label, index) => {
          return (
            <div className="mb-2 block" key={index}>
              <Label htmlFor={label} value={label} className="capitalize" />
              <TextInput
                id={label}
                placeholder={`Enter ${label} here`}
                required
                type="text"
                onChange={(e) => updateForm({ [label]: e.target.value })}
              />
            </div>
          );
        })}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}

export default Create;
