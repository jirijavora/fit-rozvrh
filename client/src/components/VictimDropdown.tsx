import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import useVictim from '../hooks/useVictim';
import { PersonData } from '../services/DataService';

/**
 * Normalize a string for search.
 * The main goal of this was to make diacritics irrelevant to search. The function also lowercases
 * the string, removes all non-alphanumeric characters and collapses whitespace into single spaces.
 * All of this should hopefully make search natural without doing any fancy fuzzy search.
 */
const normalizeForSearch = (name: String): string =>
  name
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ');

type SearchableVictim = PersonData & {
  normalizedName: string;
};

export function VictimDropdown() {
  const { setVictimId, people } = useVictim();
  const [victimSearch, setVictimSearch] = useState<string>('');
  const [displayVictimDropdown, setDisplayVictimDropdown] =
    useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const firstVictimRef = useRef<HTMLAnchorElement>(
    null,
  ) as MutableRefObject<HTMLAnchorElement>;
  const lastVictimRef = useRef<HTMLAnchorElement>(
    null,
  ) as MutableRefObject<HTMLAnchorElement>;

  useEffect(() => {
    if (displayVictimDropdown) {
      searchRef?.current?.focus();
    } else {
      setVictimSearch('');
    }
  }, [displayVictimDropdown]);

  const victimSearchLowerCase = normalizeForSearch(victimSearch);

  const searchableVictims = useMemo(
    () =>
      people.map(
        (victim): SearchableVictim => ({
          ...victim,
          normalizedName: normalizeForSearch(victim.name),
        }),
      ),
    [people],
  );

  const filteredVictims = useMemo(
    () =>
      searchableVictims.filter((victim) =>
        victim.normalizedName.startsWith(victimSearchLowerCase),
      ),
    [victimSearch, searchableVictims],
  );

  // TODO: refactor
  return (
    <Dropdown
      focusFirstItemOnShow={false}
      onToggle={(show) => {
        setDisplayVictimDropdown(show);
      }}
      show={displayVictimDropdown}
      align="end"
    >
      <Dropdown.Toggle
        className="text-bold bg-black"
        variant="secondary"
        id="dropdown-basic"
      >
        VICTIM
      </Dropdown.Toggle>
      <Dropdown.Menu
        renderOnMount
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Dropdown.Header>
          <input
            ref={searchRef}
            value={victimSearch}
            onChange={(e) => {
              setVictimSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              switch (e.key) {
                case 'ArrowUp':
                  lastVictimRef?.current?.focus();
                  break;
                case 'ArrowDown':
                  firstVictimRef?.current?.focus();
                  break;
                case 'Enter':
                  firstVictimRef?.current?.click();
                  break;
                default:
                  // Do nothing
                  return;
              }

              e.preventDefault();
              e.stopPropagation();
            }}
          />
        </Dropdown.Header>
        {filteredVictims.map((person, i, { length }) => {
          const isFirst = i === 0;
          const isLast = i === length - 1;

          return (
            <Dropdown.Item
              key={person.name}
              onClick={() => {
                setVictimId(person.id);
              }}
              ref={(el: HTMLAnchorElement) => {
                if (isFirst) firstVictimRef.current = el;
                if (isLast) lastVictimRef.current = el;
              }}
              onKeyDown={(e) => {
                if (isFirst && e.key === 'ArrowUp') {
                  searchRef.current?.focus();
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                if (isLast && e.key === 'ArrowDown') {
                  firstVictimRef?.current?.focus();
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {person.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
