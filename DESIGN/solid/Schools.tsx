import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import {
  DeleteSchoolDocument,
  GetSchoolsDocument,
  GetSchoolsQuery,
  QueryGetSchoolsArgs,
} from "../../generated/graphql";
import { Box, CircularProgress, Container } from "@material-ui/core";
import { SchoolsTable } from "./SchoolsTable";
import { SearchBar } from "./SearchBar/SearchBar";
import { ConfirmationModal } from "./ConfirmationModal";
import { useResetPageOnSearch } from "../../hooks"
import { CustomTablePagination } from "../shared/CustomTablePagination";
import { ErrorMessageSnackbar } from "../shared/ErrorMessageSnackbar";
import {
  ButtonPlus,
  Header,
  LoadingBox,
} from "../shared/Style/Style";

interface ActiveFilterState {
  searchKey?: string;
}

export const Schools = () => {
  const { push } = useHistory();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [activeFilter, setActiveFilter] = useState<ActiveFilterState>({
    searchKey: "",
  });
  const [requestError, setRequestError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [schoolIdToDelete, setSchoolIdToDelete] = useState<string | null>(null);
  const [confirmationModalOpened, setConfirmationModalOpened] = useState(false);

  const searchKey = activeFilter.searchKey ? activeFilter.searchKey : undefined;

  const getSchoolVariables: QueryGetSchoolsArgs = {
    limit: rowsPerPage,
    skip: page * rowsPerPage,
    searchKey,
  };

  const {
    data: getSchoolsData,
    loading: getSchoolsLoading,
    error: getSchoolsError,
  } = useQuery<GetSchoolsQuery>(GetSchoolsDocument, {
    variables: getSchoolVariables,
    fetchPolicy: "network-only",
  });

  const [deleteSchool, {
    loading: deleteSchoolLoading,
    error: deleteSchoolError,
  }] = useMutation(DeleteSchoolDocument, {
    refetchQueries: [{
      query: GetSchoolsDocument,
      variables: {
        limit: rowsPerPage,
        skip: page * rowsPerPage,
        searchKey,
      },
    }],
  });

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSchoolDeletion = () => {
    deleteSchool({ variables: { id: schoolIdToDelete } });
    setConfirmationModalOpened(false);
    setSchoolIdToDelete(null);
  };

  const handleOpen = () => {
    setConfirmationModalOpened(true);
  };

  const handleClose = () => {
    setConfirmationModalOpened(false);
    setSchoolIdToDelete(null);
  };

  useResetPageOnSearch({ searchKey, setPage });

  useEffect(() => {
    if (getSchoolsError) {
      setRequestError(true);
      setErrorMessage("При загрузке списка школ произошла ошибка");
    }
  }, [getSchoolsError]);

  useEffect(() => {
    if (deleteSchoolError) {
      setRequestError(true);
      setErrorMessage("При удалении школы произошла ошибка");
    }
  }, [deleteSchoolError]);

  const disableOnLoading = getSchoolsLoading || deleteSchoolLoading;

  let content = null;
  let pagination = null;

  if (disableOnLoading) {
    content = (
      <LoadingBox>
        <CircularProgress color="inherit" />
      </LoadingBox>
    );
  }

  if (getSchoolsData) {
    const getSchools = getSchoolsData?.getSchools;
    const schools = getSchools?.schools;

    content = (
      <SchoolsTable
        schools={schools}
        setSchoolIdToDelete={setSchoolIdToDelete}
        openModal={handleOpen}
      />
    );

    pagination = (
      <>
        {schools?.length > 0 ? (
          <CustomTablePagination
            rowsPerPageOptions={[10, 20]}
            count={getSchools?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        ) : null}
      </>
    );
  }

  return (
    <Container maxWidth="lg">
      <Header>Школы</Header>

      <ConfirmationModal
        open={confirmationModalOpened}
        onConfirm={handleSchoolDeletion}
        onClose={handleClose}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box flex="0 0 30%">
          <SearchBar
            label="Поиск..."
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </Box>

        <Box>
          <ButtonPlus
            width={180}
            variant="contained"
            disabled={disableOnLoading}
            onClick={() => push("/school")}
          >
            Добавить
          </ButtonPlus>
        </Box>
      </Box>

      {pagination}

      {content}

      {pagination}

      <ErrorMessageSnackbar
        open={requestError}
        message={errorMessage}
        closeHandler={() => setRequestError(false)}
      />
    </Container>
  );
};
