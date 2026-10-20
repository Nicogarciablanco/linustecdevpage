import styled from 'styled-components'
import { DisplayHeading } from '../../components/ui/Layout'

export const Dialog = styled.dialog`
  width: min(860px, calc(100% - 32px));
  max-height: calc(100svh - 32px);
  margin: auto;
  padding: 0;
  overflow: auto;
  color: ${({ theme }) => theme.colors.ink};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.dialog};
  &::backdrop {
    background: rgba(2, 6, 23, 0.68);
    backdrop-filter: blur(5px);
  }
`

export const DialogContent = styled.div`
  min-width: 0;
  .submission-verification {
    margin-top: 20px;
    font-size: 13px;
    line-height: 1.6;
  }
  [role='alert'] {
    color: #a52e2e;
  }
  button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  h2,
  h3 {
    color: ${({ theme }) => theme.colors.ink};
  }
  padding: 30px;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 21px;
  }
`

export const DialogTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  > div {
    min-width: 0;
  }
  p {
    margin: 0 0 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
  }
`

export const DialogTitle = styled(DisplayHeading)`
  max-width: 580px;
  font-size: clamp(26px, 3.7vw, 38px);
  line-height: 1.07;
  &:focus {
    outline: none;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: clamp(24px, 7vw, 30px);
  }
`

export const CloseButton = styled.button`
  flex: 0 0 auto;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid #cfd6d5;
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
`

export const StepList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin: 22px 0;
  padding: 0;
  list-style: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  [aria-current='step'] {
    color: ${({ theme }) => theme.colors.tealText};
    font-weight: 800;
  }
`

export const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(230px, 1fr);
  gap: 23px;
  > * {
    min-width: 0;
  }
  @media (max-width: 750px) {
    grid-template-columns: 1fr;
  }
`

export const DialogCopy = styled.p`
  margin: 0 0 23px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.6;
`

export const FieldTitle = styled.h3`
  margin: 0 0 12px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  & + p {
    margin: 0 0 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
  }
`

export const ChoiceList = styled.div`
  display: grid;
  gap: 9px;
  margin-bottom: 23px;
`

export const CheckOption = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border: 1px solid #cfd6d5;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.page};
  cursor: pointer;
  &:has(input:checked) {
    border-color: ${({ theme }) => theme.colors.tealHeading};
  }
  input {
    flex: 0 0 auto;
    width: 17px;
    height: 17px;
    margin: 2px 0 0;
    accent-color: ${({ theme }) => theme.colors.tealHeading};
  }
  span {
    flex: 1;
    min-width: 0;
  }
  strong {
    display: block;
    font-size: 12px;
  }
  small {
    display: block;
    margin-top: 3px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
    line-height: 1.45;
  }
  b {
    color: ${({ theme }) => theme.colors.tealText};
    font-size: 11px;
    white-space: nowrap;
  }
  @media (max-width: 420px) {
    flex-wrap: wrap;
    b {
      margin-left: 27px;
    }
  }
`

export const SummaryPanel = styled.aside`
  align-self: start;
  min-width: 0;
  padding: 19px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.page};
  h3 {
    margin: 0 0 17px;
    font-size: 15px;
    font-weight: 800;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
    line-height: 1.5;
  }
  .row strong {
    flex: 0 0 auto;
    color: ${({ theme }) => theme.colors.ink};
    white-space: nowrap;
  }
  .total {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #c5cfcb;
  }
  .total small {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
  }
  .total strong {
    font-size: 27px;
    letter-spacing: -0.06em;
  }
  p {
    margin: 14px 0 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
    line-height: 1.6;
  }
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  .wide {
    grid-column: 1 / -1;
  }
  @media (max-width: 620px) {
    grid-template-columns: 1fr;
    .wide {
      grid-column: auto;
    }
  }
`

export const FormLabel = styled.label`
  display: grid;
  min-width: 0;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  input,
  textarea,
  select {
    width: 100%;
    min-width: 0;
    padding: 12px;
    border: 1px solid #bcc8c2;
    border-radius: 9px;
    color: ${({ theme }) => theme.colors.ink};
    background: white;
    font-size: 14px;
    font-weight: 400;
  }
  textarea {
    min-height: 88px;
    resize: vertical;
  }
  [aria-invalid='true'] {
    border-color: #a52e2e;
  }
  small {
    color: #a52e2e;
    font-size: 11px;
  }
  span {
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
  }
`

export const FormNote = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  line-height: 1.5;
`

export const ReviewPanel = styled.div`
  min-width: 0;
  padding: 22px;
  border: 1px solid #d0d8d4;
  border-radius: 12px;
  background: white;
  font-size: 13px;
  line-height: 1.65;
  h3 {
    margin: 0 0 14px;
    font-size: 17px;
  }
  aside {
    margin-bottom: 20px;
  }
  dl {
    display: grid;
    gap: 10px;
    margin: 0;
  }
  dt {
    font-weight: 700;
  }
  dd {
    margin: 0;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }
  .review-note {
    margin: 18px 0 0;
    padding: 14px;
    border-radius: 10px;
    color: #174938;
    background: #e1f3ec;
    font-size: 12px;
  }
  @media (max-width: 420px) {
    padding: 15px;
  }
`

export const DialogFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #d6ddda;
  p {
    max-width: 330px;
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 11px;
    line-height: 1.5;
  }
  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
  }
  button {
    min-height: 44px;
    padding-inline: 18px;
    font-size: 12px;
    box-shadow: none;
  }
  @media (max-width: 750px) {
    align-items: flex-start;
    flex-direction: column;
  }
`

export const SecondaryButton = styled.button`
  padding: 13px 18px;
  border: 1px solid #b9c4c1;
  border-radius: 30px;
  color: ${({ theme }) => theme.colors.ink};
  background: ${({ theme }) => theme.colors.surface};
  font-weight: 700;
  cursor: pointer;
`
