import { useOptions } from 'unfold-utils';

const Options = (): JSX.Element => {
  const { options, setOption } = useOptions();

  return (
    <div className="mx-auto max-w-2xl py-4 text-sm text-gray-700">
      <div className="mb-3">
        unfold <span className="font-semibold">research</span>
      </div>

      <section>
        <h2>Sidebar:</h2>
        <div className="grid-cols-mm grid gap-x-3 gap-y-1">
          {/* Side of the screen:{' '}
          <select>
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select> */}
          Default width when expanded:{' '}
          <span>
            <input type="number" value="400" max="1000" min="200" />
            px
          </span>
          Toolbar offset (from the top):{' '}
          <span>
            <input
              type="number"
              max="2000"
              min="0"
              value={options.positionOffset}
              onChange={(e) => {
                setOption({
                  positionOffset: parseInt(e.target.value),
                });
              }}
            />
            px
          </span>
          {/* Size of the toolbar:{' '}
          <span>
            <input type="number" value="24" max="128" min="16" />
            px
          </span> */}
          {/* Show expanded by default:
          <input type="checkbox" /> */}
        </div>
      </section>

      {/* <section>
        <h2>Behavior</h2>
        <div>
          <input type="checkbox" /> Enable in-page link checking
        </div>
      </section> */}

      <section>
        <h2>Blacklist:</h2>
        <p>
          The toolbar and the sidebar won't be activated on the pages whose URL matches any of the URLs in this list.
        </p>
        <p>You can use the wildcard (*) to match parts of the URL. Use one line per URL pattern.</p>
        <textarea rows={5} />

        <h2>Whitelist:</h2>
        <p>The pages that match any of the URLs in this list can override those from the blacklist.</p>
        <textarea rows={5} />

        <h2>Test filter:</h2>
        <input />
        <p>Result: ...TODO...</p>
      </section>

      <section>
        <h2>Analytics</h2>

        <span className="flex items-center gap-1">
          <input type="checkbox" defaultChecked />
          Send usage statistics
        </span>
        <p>(if this option is unchecked, no additional data regarding usage statistics will be sent)</p>
        <p>
          For more details see our <a href="https://unfoldresearch.com/privacy-policy">Privacy Policy</a>.
        </p>
      </section>
    </div>
  );
};

export default Options;
