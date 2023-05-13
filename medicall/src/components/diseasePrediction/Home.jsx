import React from "react";

const Home = (props) => {

  return (
    <>
      <div id="home" className="tablet:grid-col padding-x-2">
        <p>Before using this symptom checker, please read carefully and accept our Terms and Services:</p>
        <ul>
          <li>🔹 This checkup is not a diagnosis.</li>
          <li>🔹 This checkup is for informational purposes and is not a qualified medical opinion.</li>
          <li>🔹 Information that you provide is anonymous and not shared with anyone.</li>
        </ul>
        <form className="usa-form TermsCheckbox">
          <div className="usa-checkbox">
            <input checked={props.isChecked} onChange={props.checked} className="usa-checkbox__input" id="truth" type="checkbox" name="historical-figures-1" value="truth" />
            <label className="usa-checkbox__label" htmlFor="truth">
              I agree to the Medicall terms and conditions
            </label>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;