import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";

const SkillOverflow = ({ skills = [], visibleCount = 2 }) => {
  if (!skills.length) return "-";

  const visibleSkills = skills.slice(0, visibleCount);
  const hiddenSkills = skills.slice(visibleCount);

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap">
      {visibleSkills.map((skill, index) => (
        <span key={index} className="skill-chip">
          {skill}
        </span>
      ))}

      {hiddenSkills.length > 0 && (
        <UncontrolledDropdown>
          <DropdownToggle
            tag="span"
            className="skill-more"
          >
            +{hiddenSkills.length} more
          </DropdownToggle>

          <DropdownMenu className="skill-tooltip" end>
            <div className="text-white skill_head">Skills</div>
            <ul className="skill-list">
              {hiddenSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </DropdownMenu>
        </UncontrolledDropdown>
      )}
    </div>
  );
};

export default SkillOverflow;
