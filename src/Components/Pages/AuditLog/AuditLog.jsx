import React, { useState } from 'react'
import Layouts from '../Layouts/Layouts'
import { ArrowLeft } from 'lucide-react'
import './auditlog.css'
import ChangeHistory from './ChangeHistory';
import ChangeSummary from './ChangeSummary';

function AuditLog() {
    const [tabId,setTabId] = useState(0)
  return (
    <Layouts>
      <div className="container-fluid p-0">
        <div className="audit-header-container">
          <div className="audit-head-left">
            Audit Log
          </div>
          {/* <div className="audit-head-right">
            <div class="btn-group-tabs">
              <button class={` btn-group-tabs__button ${tabId===0 && 'active'}`} onClick={()=>setTabId(0)}>
                Change History
              </button>
              <button class={`btn-group-tabs__button ${tabId===1 && 'active'}`}  onClick={()=>setTabId(1)}>Change Summary</button>
            </div>
          </div> */}
        </div>
        <div className='audit-main-section'>
            {
                tabId === 0 ?  <ChangeHistory/> : tabId ===1 ? <ChangeSummary/> :""
            }
            
        </div>
      </div>
    </Layouts>
  );
}

export default AuditLog