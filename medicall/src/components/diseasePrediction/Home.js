

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
        <form class="usa-form TermsCheckbox">
          <div class="usa-checkbox">
            <input checked={props.isChecked} onChange={props.checked} class="usa-checkbox__input" id="truth" type="checkbox" name="historical-figures-1" value="truth" />
            <label class="usa-checkbox__label" for="truth">
              I agree to the Medicall terms and conditions
            </label>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;