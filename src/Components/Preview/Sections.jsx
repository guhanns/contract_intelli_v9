import React, { useEffect, useState } from 'react'
import request from '../../api/api';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'reactstrap';
import { truncate } from 'lodash';
import layoutLeft from "../../images/icons/layout-left.svg";
import { BeatLoader } from "react-spinners"; 


const loadingMessages = [
  "Scanning your document…",
  "Identifying main sections…",
  "Detecting nested subsections…",
  "Mapping document structure…",
  "Refining section hierarchy…",
  "Extracting key entities and labels…",
  "Linking related clauses and references…",
  "Organizing data for preview…",
  "Almost there — preparing your structured view…",
  "Sections and subsections are ready!"
];


const groupChunksBySection = (chunks) => {
  const grouped = chunks.reduce((acc, chunk) => {
    const section = chunk.section || "Unknown Section";
    const subsection = chunk.subsection || "Unknown Subsection";

    if (!acc[section]) {
      acc[section] = {};
    }

    if (!acc[section][subsection]) {
      acc[section][subsection] = [];
    }

    acc[section][subsection].push(chunk);
    return acc;
  }, {});

  return Object.entries(grouped).map(([section, subsections]) => ({
    section,
    subsections: Object.entries(subsections).map(([title, subsectionList]) => ({
      title,
      subsectionList
    }))
  }));
};



function Sections({filename}) {
    const [isSection,setIsSection] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
  const [sectionList, setSectionList] = useState([]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [open, setOpen] = useState(null);

  useEffect(() => {
  if (!isLoading) {
    setMessageIndex(0);
    return;
  }

  const interval = setInterval(() => {
    setMessageIndex((prev) =>
      prev + 1 < loadingMessages.length ? prev + 1 : prev
    );
  }, 30000); // 30 sec

  return () => clearInterval(interval);
}, [isLoading]);

  const fetchSection = async() => {
    request({
      url: `/icontract/backend/classify-document/${filename}`,
      method: "POST",
    })
      .then((res) => {
        setIsLoading(false);
        setSectionList(groupChunksBySection(res.chunks));
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if(filename){
        fetchSection();
    }
    // eslint-disable-next-line
  }, [filename]);

  const toggleSectionAcc = (id) => {
    setOpen(open === id ? null : id);
  };

  const toggleSection = () =>{
    setIsSection(!isSection)
  }

  if (isLoading) {
    return <div className='section-no-result'>
        <div>
            <BeatLoader size={10} color='var(--text)'/>
        </div>
            {loadingMessages[messageIndex]}
          </div>;
  }

  // Prepare sections array for the accordion
//   const sections = Object.entries(sectionList).map(([title, subsections]) => ({
//     title,
//     subsections,
//   }));


const handleScrollToPage = (pageNum) => {
    const pageElement = document.querySelector(`[data-page-number="${pageNum}"]`);
    console.log(pageElement)
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
};

  console.log(sectionList)
  return (
    
      
        <div className="section-list-acc">
            {
                sectionList?.length> 0 ? <Accordion
            open={open}
            toggle={toggleSectionAcc}
            className="custom-accordion"
          >
            {sectionList?.map((sec, idx) => (
              <AccordionItem key={idx}>
                <AccordionHeader targetId={`${idx + 1}`}>
                  <div className='turncate-head'>
                    {sec?.section}
                  </div>
                </AccordionHeader>
                <AccordionBody accordionId={`${idx + 1}`}>
                  {sec?.subsections?.length > 0 && (
                    <ul className="subsection-list ">
                      {sec?.subsections?.map((sub, subIdx) => (
                        <li key={subIdx} className='turncate-head' onClick={()=>handleScrollToPage(sub?.subsectionList[0]?.page_number)}>{sub?.title}</li>
                      ))}
                    </ul>
                  )}
                </AccordionBody>
              </AccordionItem>
            ))}
          </Accordion> : <div className='section-no-result'>
            AI identifying sections & sub sections…
          </div>
            }
          
        </div>
  );
}

export default Sections